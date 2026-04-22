/**
 * ESLint rule to forbid importing from page components unless they are in a __shared__ folder
 */

import path from "path";

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Forbid importing from external page components unless they are in a __shared__ folder or within the same page directory",
      category: "Best Practices",
      recommended: false,
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          pagesPattern: {
            type: "string",
            description:
              "Glob pattern to match page directories (default: '**/pages/**')",
          },
          sharedFolderName: {
            type: "string",
            description: "Name of the shared folder (default: '__shared__')",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noPageImport:
        "Importing from external page components is not allowed. Only imports from '{{sharedFolder}}' folders or within the same page directory are permitted.",
    },
  },

  create(context) {
    const options = context.options[0] || {};

    const sharedFolderName = options.sharedFolderName || "__shared__";

    function isPageImport(importPath) {
      // Check if the import path contains /pages/
      // Handle both direct paths and @/ alias paths
      if (importPath.startsWith("@/")) {
        return importPath.includes("/pages/");
      }
      return importPath.includes("/pages/");
    }

    function isSharedImport(importPath, sharedFolder) {
      // Check if the import path contains the shared folder
      // Handle both direct paths and @/ alias paths
      return importPath.includes(`/${sharedFolder}/`);
    }

    function isRelativePageImport(importPath, currentFilePath) {
      // Handle relative imports like ../../../pages/something
      if (!importPath.startsWith(".")) {
        return false;
      }

      // Get the directory of the current file
      const currentDir = path.dirname(currentFilePath);

      try {
        // Resolve the relative path to an absolute path
        const resolvedPath = path.resolve(currentDir, importPath);
        return resolvedPath.includes("/pages/");
      } catch {
        // If path resolution fails, assume it's not a page import
        return false;
      }
    }

    function isSamePageImport(importPath, currentFilePath) {
      // Check if the import is from the same page directory
      let resolvedImportPath;

      if (importPath.startsWith(".")) {
        // Handle relative imports
        try {
          const currentDir = path.dirname(currentFilePath);
          resolvedImportPath = path.resolve(currentDir, importPath);
        } catch {
          return false;
        }
      } else if (importPath.startsWith("@/")) {
        // Handle @/ path alias imports
        // Convert @/ to absolute path based on src directory
        const srcIndex = currentFilePath.indexOf("/src/");
        if (srcIndex === -1) {
          return false;
        }
        const srcPath = currentFilePath.substring(0, srcIndex + 5); // Include /src/
        resolvedImportPath = path.join(srcPath, importPath.substring(2)); // Remove @/
      } else {
        return false;
      }

      // Find the page folder for the current file
      const currentPageMatch = currentFilePath.match(/\/pages\/([^/]+)/);
      if (!currentPageMatch) {
        return false; // Current file is not in a page directory
      }

      // Find the page folder for the import
      const importPageMatch = resolvedImportPath.match(/\/pages\/([^/]+)/);
      if (!importPageMatch) {
        return false; // Import is not from a page directory
      }

      // Check if they're in the same page folder
      return currentPageMatch[1] === importPageMatch[1];
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFilePath = context.getFilename();

        // Skip if not importing from pages
        if (
          !isPageImport(importPath) &&
          !isRelativePageImport(importPath, currentFilePath)
        ) {
          return;
        }

        // Allow if importing from shared folder
        if (isSharedImport(importPath, sharedFolderName)) {
          return;
        }

        // Allow if importing from the same page directory
        if (isSamePageImport(importPath, currentFilePath)) {
          return;
        }

        // Report violation
        context.report({
          node: node.source,
          messageId: "noPageImport",
          data: {
            sharedFolder: sharedFolderName,
          },
        });
      },

      // Handle dynamic imports as well
      CallExpression(node) {
        if (
          node.callee.type === "Import" ||
          (node.callee.type === "Identifier" && node.callee.name === "import")
        ) {
          if (
            node.arguments.length > 0 &&
            node.arguments[0].type === "Literal"
          ) {
            const importPath = node.arguments[0].value;
            const currentFilePath = context.getFilename();

            // Skip if not importing from pages
            if (
              !isPageImport(importPath) &&
              !isRelativePageImport(importPath, currentFilePath)
            ) {
              return;
            }

            // Allow if importing from shared folder
            if (isSharedImport(importPath, sharedFolderName)) {
              return;
            }

            // Allow if importing from the same page directory
            if (isSamePageImport(importPath, currentFilePath)) {
              return;
            }

            // Report violation
            context.report({
              node: node.arguments[0],
              messageId: "noPageImport",
              data: {
                sharedFolder: sharedFolderName,
              },
            });
          }
        }
      },
    };
  },
};
