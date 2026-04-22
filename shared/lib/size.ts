// Size constants in bytes (binary - powers of 1024)
export const BYTE = 1;
export const KILOBYTE = 1024;
export const MEGABYTE = 1024 * 1024;
export const GIGABYTE = 1024 * 1024 * 1024;
export const TERABYTE = 1024 * 1024 * 1024 * 1024;
export const PETABYTE = 1024 * 1024 * 1024 * 1024 * 1024;

// Decimal size constants (powers of 1000)
export const KILOBYTE_DECIMAL = 1000;
export const MEGABYTE_DECIMAL = 1000 * 1000;
export const GIGABYTE_DECIMAL = 1000 * 1000 * 1000;
export const TERABYTE_DECIMAL = 1000 * 1000 * 1000 * 1000;
export const PETABYTE_DECIMAL = 1000 * 1000 * 1000 * 1000 * 1000;

export const SIZE_BINARY = Object.freeze({
  PETABYTE: {
    IN_TERABYTES: PETABYTE / TERABYTE,
    IN_GIGABYTES: PETABYTE / GIGABYTE,
    IN_MEGABYTES: PETABYTE / MEGABYTE,
    IN_KILOBYTES: PETABYTE / KILOBYTE,
    IN_BYTES: PETABYTE / BYTE,
  },
  TERABYTE: {
    IN_GIGABYTES: TERABYTE / GIGABYTE,
    IN_MEGABYTES: TERABYTE / MEGABYTE,
    IN_KILOBYTES: TERABYTE / KILOBYTE,
    IN_BYTES: TERABYTE / BYTE,
  },
  GIGABYTE: {
    IN_MEGABYTES: GIGABYTE / MEGABYTE,
    IN_KILOBYTES: GIGABYTE / KILOBYTE,
    IN_BYTES: GIGABYTE / BYTE,
  },
  MEGABYTE: {
    IN_KILOBYTES: MEGABYTE / KILOBYTE,
    IN_BYTES: MEGABYTE / BYTE,
  },
  KILOBYTE: {
    IN_BYTES: KILOBYTE / BYTE,
  },
});

export const SIZE_DECIMAL = Object.freeze({
  PETABYTE: {
    IN_TERABYTES: PETABYTE_DECIMAL / TERABYTE_DECIMAL,
    IN_GIGABYTES: PETABYTE_DECIMAL / GIGABYTE_DECIMAL,
    IN_MEGABYTES: PETABYTE_DECIMAL / MEGABYTE_DECIMAL,
    IN_KILOBYTES: PETABYTE_DECIMAL / KILOBYTE_DECIMAL,
    IN_BYTES: PETABYTE_DECIMAL / BYTE,
  },
  TERABYTE: {
    IN_GIGABYTES: TERABYTE_DECIMAL / GIGABYTE_DECIMAL,
    IN_MEGABYTES: TERABYTE_DECIMAL / MEGABYTE_DECIMAL,
    IN_KILOBYTES: TERABYTE_DECIMAL / KILOBYTE_DECIMAL,
    IN_BYTES: TERABYTE_DECIMAL / BYTE,
  },
  GIGABYTE: {
    IN_MEGABYTES: GIGABYTE_DECIMAL / MEGABYTE_DECIMAL,
    IN_KILOBYTES: GIGABYTE_DECIMAL / KILOBYTE_DECIMAL,
    IN_BYTES: GIGABYTE_DECIMAL / BYTE,
  },
  MEGABYTE: {
    IN_KILOBYTES: MEGABYTE_DECIMAL / KILOBYTE_DECIMAL,
    IN_BYTES: MEGABYTE_DECIMAL / BYTE,
  },
  KILOBYTE: {
    IN_BYTES: KILOBYTE_DECIMAL / BYTE,
  },
});

// Binary conversions (1024-based)
export const binary = {
  // From Bytes
  bytesToKilobytes: (bytes: number) => bytes / KILOBYTE,
  bytesToMegabytes: (bytes: number) => bytes / MEGABYTE,
  bytesToGigabytes: (bytes: number) => bytes / GIGABYTE,
  bytesToTerabytes: (bytes: number) => bytes / TERABYTE,
  bytesToPetabytes: (bytes: number) => bytes / PETABYTE,

  // From Kilobytes
  kilobytesToBytes: (kb: number) => kb * KILOBYTE,
  kilobytesToMegabytes: (kb: number) => kb / KILOBYTE,
  kilobytesToGigabytes: (kb: number) => kb / MEGABYTE,
  kilobytesToTerabytes: (kb: number) => kb / GIGABYTE,
  kilobytesToPetabytes: (kb: number) => kb / TERABYTE,

  // From Megabytes
  megabytesToBytes: (mb: number) => mb * MEGABYTE,
  megabytesToKilobytes: (mb: number) => mb * KILOBYTE,
  megabytesToGigabytes: (mb: number) => mb / KILOBYTE,
  megabytesToTerabytes: (mb: number) => mb / MEGABYTE,
  megabytesToPetabytes: (mb: number) => mb / GIGABYTE,

  // From Gigabytes
  gigabytesToBytes: (gb: number) => gb * GIGABYTE,
  gigabytesToKilobytes: (gb: number) => gb * MEGABYTE,
  gigabytesToMegabytes: (gb: number) => gb * KILOBYTE,
  gigabytesToTerabytes: (gb: number) => gb / KILOBYTE,
  gigabytesToPetabytes: (gb: number) => gb / MEGABYTE,

  // From Terabytes
  terabytesToBytes: (tb: number) => tb * TERABYTE,
  terabytesToKilobytes: (tb: number) => tb * GIGABYTE,
  terabytesToMegabytes: (tb: number) => tb * MEGABYTE,
  terabytesToGigabytes: (tb: number) => tb * KILOBYTE,
  terabytesToPetabytes: (tb: number) => tb / KILOBYTE,

  // From Petabytes
  petabytesToBytes: (pb: number) => pb * PETABYTE,
  petabytesToKilobytes: (pb: number) => pb * TERABYTE,
  petabytesToMegabytes: (pb: number) => pb * GIGABYTE,
  petabytesToGigabytes: (pb: number) => pb * MEGABYTE,
  petabytesToTerabytes: (pb: number) => pb * KILOBYTE,
};

// Decimal conversions (1000-based)
export const decimal = {
  // From Bytes
  bytesToMegabytes: (bytes: number) => bytes / MEGABYTE_DECIMAL,
  bytesToGigabytes: (bytes: number) => bytes / GIGABYTE_DECIMAL,
  bytesToTerabytes: (bytes: number) => bytes / TERABYTE_DECIMAL,
  bytesToPetabytes: (bytes: number) => bytes / PETABYTE_DECIMAL,

  // From Kilobytes
  kilobytesToBytes: (kb: number) => kb * KILOBYTE_DECIMAL,
  kilobytesToMegabytes: (kb: number) => kb / KILOBYTE_DECIMAL,
  kilobytesToGigabytes: (kb: number) => kb / MEGABYTE_DECIMAL,
  kilobytesToTerabytes: (kb: number) => kb / GIGABYTE_DECIMAL,
  kilobytesToPetabytes: (kb: number) => kb / TERABYTE_DECIMAL,

  // From Megabytes
  megabytesToBytes: (mb: number) => mb * MEGABYTE_DECIMAL,
  megabytesToKilobytes: (mb: number) => mb * KILOBYTE_DECIMAL,
  megabytesToGigabytes: (mb: number) => mb / KILOBYTE_DECIMAL,
  megabytesToTerabytes: (mb: number) => mb / MEGABYTE_DECIMAL,
  megabytesToPetabytes: (mb: number) => mb / GIGABYTE_DECIMAL,

  // From Gigabytes
  gigabytesToBytes: (gb: number) => gb * GIGABYTE_DECIMAL,
  gigabytesToKilobytes: (gb: number) => gb * MEGABYTE_DECIMAL,
  gigabytesToMegabytes: (gb: number) => gb * KILOBYTE_DECIMAL,
  gigabytesToTerabytes: (gb: number) => gb / KILOBYTE_DECIMAL,
  gigabytesToPetabytes: (gb: number) => gb / MEGABYTE_DECIMAL,

  // From Terabytes
  terabytesToBytes: (tb: number) => tb * TERABYTE_DECIMAL,
  terabytesToKilobytes: (tb: number) => tb * GIGABYTE_DECIMAL,
  terabytesToMegabytes: (tb: number) => tb * MEGABYTE_DECIMAL,
  terabytesToGigabytes: (tb: number) => tb * KILOBYTE_DECIMAL,
  terabytesToPetabytes: (tb: number) => tb / KILOBYTE_DECIMAL,

  // From Petabytes
  petabytesToBytes: (pb: number) => pb * PETABYTE_DECIMAL,
  petabytesToKilobytes: (pb: number) => pb * TERABYTE_DECIMAL,
  petabytesToMegabytes: (pb: number) => pb * GIGABYTE_DECIMAL,
  petabytesToGigabytes: (pb: number) => pb * MEGABYTE_DECIMAL,
  petabytesToTerabytes: (pb: number) => pb * KILOBYTE_DECIMAL,
};

type FormatBytesArgs = {
  bytes: number;
  decimals?: number;
  useBinary?: boolean;
};

export const formatBytes = ({
  bytes,
  decimals = 2,
  useBinary = true,
}: FormatBytesArgs): string => {
  if (bytes === 0) return "0 Bytes";

  const k = useBinary ? 1024 : 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = useBinary
    ? ["Bytes", "KB", "MB", "GB", "TB", "PB"]
    : ["Bytes", "kB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
