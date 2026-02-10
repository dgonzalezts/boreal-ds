import { readFile, readdir, writeFile, mkdir } from "fs/promises";
import { join, extname, basename } from "path";
import { compileString } from "sass-embedded";

/**
 * Global Generator
 * Compiles SCSS files from styles/global directory and includes them in CSS output
 * Also copies SCSS files to dist/scss/global for direct SCSS consumption
 */
export class GlobalGenerator {
  private globalStylesPath: string;
  private outputDir: string;

  constructor(
    globalStylesPath: string = "src/styles/global",
    outputDir: string = "dist",
  ) {
    this.globalStylesPath = globalStylesPath;
    this.outputDir = outputDir;
  }

  /** Compile all SCSS files from the global styles directory */
  async compileGlobalStyles(): Promise<string> {
    try {
      const files = await readdir(join(process.cwd(), this.globalStylesPath));
      const scssFiles = files.filter((file) => extname(file) === ".scss");

      if (scssFiles.length === 0) {
        return "";
      }

      const compiledStyles: string[] = [];

      for (const file of scssFiles) {
        const filePath = join(process.cwd(), this.globalStylesPath, file);
        const scssContent = await readFile(filePath, "utf-8");

        const result = compileString(scssContent, {
          loadPaths: [join(process.cwd(), this.globalStylesPath)],
        });

        compiledStyles.push(`/* ${file} */\n${result.css}`);
        console.log(`✓ Compiled ${file}`);
      }

      return compiledStyles.join("\n\n");
    } catch (error) {
      // If directory doesn't exist or other errors, return empty string
      return "";
    }
  }

  /** Copy SCSS files to dist/scss/global directory */
  async generateSCSSGlobalFiles(): Promise<string[]> {
    try {
      const files = await readdir(join(process.cwd(), this.globalStylesPath));
      const scssFiles = files.filter((file) => extname(file) === ".scss");

      if (scssFiles.length === 0) {
        return [];
      }

      // Create global directory
      await mkdir(join(this.outputDir, "scss", "global"), { recursive: true });

      const generatedFiles: string[] = [];

      for (const file of scssFiles) {
        const sourcePath = join(
          process.cwd(),
          this.globalStylesPath,
          file,
        );
        const content = await readFile(sourcePath, "utf-8");

        // Add underscore prefix if not present
        const fileName = file.startsWith("_") ? file : `_${file}`;
        const destPath = join(this.outputDir, "scss", "global", fileName);

        await writeFile(destPath, content, "utf-8");
        generatedFiles.push(fileName);
        console.log(`✓ Generated scss/global/${fileName}`);
      }

      return generatedFiles;
    } catch (error) {
      return [];
    }
  }

  /** Generate global SCSS index file */
  async generateGlobalSCSSIndex(files: string[]): Promise<void> {
    if (files.length === 0) {
      return;
    }

    const imports = files
      .map((file) => `@forward '${file.replace(".scss", "")}';`)
      .join("\n");

    const indexPath = join(this.outputDir, "scss", "global", "_index.scss");
    await writeFile(indexPath, imports, "utf-8");
    console.log("✓ Generated scss/global/_index.scss");
  }
}
