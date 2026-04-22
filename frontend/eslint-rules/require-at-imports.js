/**
 * ESLint rule to enforce that all relative imports use @ path aliases
 */

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce that all imports use @ path aliases instead of relative imports",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          allowedPrefixes: {
            type: "array",
            items: {
              type: "string",
            },
            description:
              "Array of allowed import prefixes (default: ['@/', '@shared/'])",
          },
          allowNodeModules: {
            type: "boolean",
            description:
              "Whether to allow imports from node_modules (default: true)",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireAtImport:
        "Import should use @ path alias instead of relative path. Use '{{suggestedPath}}' instead.",
      invalidAtImport:
        "Import must start with an allowed @ path prefix: {{allowedPrefixes}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const allowedPrefixes = options.allowedPrefixes || ["@/", "@shared/"];
    const allowNodeModules = options.allowNodeModules !== false;

    function isRelativeImport(importPath) {
      return importPath.startsWith("./") || importPath.startsWith("../");
    }

    function isNodeModuleImport(importPath) {
      // Node module imports don't start with ./ or ../
      // They can start with @ (like @tanstack/react-query) but shouldn't match our configured prefixes
      if (importPath.startsWith("./") || importPath.startsWith("../")) {
        return false;
      }

      // If it starts with @, check if it's one of our configured path aliases
      if (importPath.startsWith("@")) {
        return !allowedPrefixes.some((prefix) => importPath.startsWith(prefix));
      }

      // Everything else is considered a node module
      return true;
    }

    function isValidAtImport(importPath) {
      return allowedPrefixes.some((prefix) => importPath.startsWith(prefix));
    }

    function convertRelativeToAtPath(importPath, currentFile) {
      // Get the directory of the current file relative to src
      const srcDir = "/src/";
      const srcIndex = currentFile.indexOf(srcDir);
      if (srcIndex === -1) {
        return null; // Can't convert if not in src directory
      }

      const relativePath = currentFile.substring(srcIndex + srcDir.length);
      const currentDir = relativePath.substring(
        0,
        relativePath.lastIndexOf("/")
      );

      // Resolve the relative import to an absolute path within src
      const resolvedPath = resolvePath(currentDir, importPath);

      return `@/${resolvedPath}`;
    }

    function resolvePath(currentDir, relativePath) {
      const parts = currentDir ? currentDir.split("/") : [];
      const relativeParts = relativePath.split("/");

      for (const part of relativeParts) {
        if (part === "..") {
          if (parts.length > 0) {
            parts.pop();
          }
        } else if (part !== ".") {
          parts.push(part);
        }
      }

      return parts.join("/");
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;

        // Skip if it's a node module and we allow them
        if (allowNodeModules && isNodeModuleImport(importPath)) {
          return;
        }

        // Check if it's a relative import
        if (isRelativeImport(importPath)) {
          const currentFile = context.getFilename();
          const suggestedPath = convertRelativeToAtPath(
            importPath,
            currentFile
          );

          context.report({
            node: node.source,
            messageId: "requireAtImport",
            data: {
              suggestedPath: suggestedPath || `@/${importPath}`,
            },
            fix(fixer) {
              if (suggestedPath) {
                return fixer.replaceText(node.source, `"${suggestedPath}"`);
              }
              return null;
            },
          });
        }
        // Check if it's an @ import but not using allowed prefixes
        else if (importPath.startsWith("@") && !isValidAtImport(importPath)) {
          context.report({
            node: node.source,
            messageId: "invalidAtImport",
            data: {
              allowedPrefixes: allowedPrefixes.join(", "),
            },
          });
        }
      },
    };
  },
};
