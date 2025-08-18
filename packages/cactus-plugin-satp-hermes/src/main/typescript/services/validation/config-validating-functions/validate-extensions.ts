import { ExtensionType } from "../../../extensions/extensions-utils";

export function validateExtensions(opts: {
  readonly configValue: unknown;
}): ExtensionType[] | undefined {
  if (!opts || !opts.configValue) {
    return;
  }
  if (!Array.isArray(opts.configValue)) {
    throw new TypeError(
      `Invalid config.extensions: ${JSON.stringify(
        opts.configValue,
      )}. Expected an array of ExtensionType.`,
    );
  }

  const extensions = opts.configValue as ExtensionType[];
  const validExtensions = extensions.filter((ext) => {
    return Object.values(ExtensionType).includes(ext);
  });
  return validExtensions.length > 0 ? validExtensions : undefined;
}
