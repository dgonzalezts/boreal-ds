import fs from 'fs';
import path from 'path';

export default function (plop) {
  // Utility function to convert kebab-case to PascalCase
  const toPascalCase = str => {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  // Utility function to strip prefix from component name (br-button -> Button)
  const stripPrefix = componentName => {
    if (!componentName) return '';
    const parts = componentName.split('-');
    const withoutPrefix = parts.slice(1).join('-');
    return toPascalCase(withoutPrefix);
  };

  // Utility function to find existing component by name and return its category
  const findExistingComponent = componentName => {
    const storiesDir = 'src/stories';

    if (!fs.existsSync(storiesDir)) {
      return null;
    }

    const categories = fs
      .readdirSync(storiesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const componentDir = path.join(storiesDir, category, componentName);
      if (fs.existsSync(componentDir)) {
        return category;
      }
    }

    return null;
  };

  // Mapping from folder names (kebab-case) to display names
  const categoryDisplayNames = {
    actions: 'Actions',
    'data-visualization': 'Data Visualization',
    feedback: 'Feedback',
    forms: 'Forms',
    helpers: 'Helpers',
    'images-icons': 'Images & Icons',
    layouts: 'Layouts',
    navigation: 'Navigation',
    overlays: 'Overlays',
    patterns: 'Patterns',
    'titles-texts': 'Titles & Texts',
    charts: 'Charts',
  };

  // Helper to get display name (with fallback for custom categories)
  const getCategoryDisplayName = folderName => {
    return (
      categoryDisplayNames[folderName] ||
      folderName
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    );
  };

  // Helper for equality comparison in templates
  plop.setHelper('eq', (a, b) => a === b);

  // Helper for current date
  plop.setHelper('dateFormat', () => new Date().toISOString().split('T')[0]);

  // Main story generator
  plop.setGenerator('story', {
    description: 'Generate a new Storybook component story',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name (kebab-case, e.g., br-button):',
        validate: value => {
          if (!value) {
            return 'Component name is required';
          }
          // Validate kebab-case format (lowercase letters, numbers, hyphens)
          if (!/^[a-z0-9]+(-[a-z0-9]+)+$/.test(value)) {
            return 'Component name must be in kebab-case format (e.g., br-button, boreal-icon-set)';
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'Select story category:',
        choices: [
          { name: 'Actions', value: 'actions' },
          { name: 'Data Visualization', value: 'data-visualization' },
          { name: 'Feedback', value: 'feedback' },
          { name: 'Forms', value: 'forms' },
          { name: 'Helpers', value: 'helpers' },
          { name: 'Images & Icons', value: 'images-icons' },
          { name: 'Layouts', value: 'layouts' },
          { name: 'Navigation', value: 'navigation' },
          { name: 'Overlays', value: 'overlays' },
          { name: 'Patterns', value: 'patterns' },
          { name: 'Titles & Texts', value: 'titles-texts' },
          { name: 'Charts', value: 'charts' },
          { name: 'Other (custom)', value: '__custom__' },
        ],
        default: 'actions',
      },
      {
        type: 'input',
        name: 'customCategory',
        message: 'Enter custom category name (use kebab-case, e.g., "my-category"):',
        when: answers => answers.category === '__custom__',
        validate: value => {
          if (!value) return 'Category is required';
          if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
            return 'Category must be in kebab-case format (lowercase letters, numbers, hyphens only)';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Component description for MDX documentation (optional):',
        default: answers => {
          // Strip prefix for description (br-button -> Button)
          const withoutPrefix = stripPrefix(answers.componentName);
          return `A ${withoutPrefix} component for the Boreal Design System`;
        },
      },
      {
        type: 'confirm',
        name: 'includeMultipleStories',
        message: 'Include additional story variants?',
        default: false,
      },
      {
        type: 'input',
        name: 'additionalStories',
        message:
          'Story names (PascalCase and comma-separated, e.g., "Disabled, Loading, WithIcon"):',
        when: answers => answers.includeMultipleStories,
        filter: value => {
          return value
            .replace(/^["']|["']$/g, '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => toPascalCase(s));
        },
      },
      {
        type: 'confirm',
        name: 'includeCategories',
        message: 'Include ArgTypes categories (Configuration, Styling, etc.)?',
        default: true,
      },
      {
        type: 'list',
        name: 'storyDisplayMode',
        message: 'How should stories be displayed in MDX documentation?',
        choices: [
          {
            name: 'Automatic - Always in sync (recommended)',
            value: 'auto',
          },
          {
            name: 'Manual - Locked at generation',
            value: 'manual',
          },
        ],
        default: 'auto',
      },
      {
        type: 'confirm',
        name: 'confirmDuplicate',
        message: answers => {
          const existingCategory = findExistingComponent(answers.componentName);
          const existingDisplay = getCategoryDisplayName(existingCategory);
          const newCategory = answers.customCategory || answers.category;
          const newDisplay = getCategoryDisplayName(newCategory);

          return `⚠️  Component "${answers.componentName}" already exists in "${existingDisplay}"

You're creating it in "${newDisplay}" - this will create a duplicate story.

Both will appear in Storybook:
  • ${existingDisplay} > ${stripPrefix(answers.componentName)}
  • ${newDisplay} > ${stripPrefix(answers.componentName)}

Continue anyway?`;
        },
        default: false,
        when: answers => {
          const existingCategory = findExistingComponent(answers.componentName);
          const newCategory = answers.customCategory || answers.category;

          return existingCategory && existingCategory !== newCategory;
        },
      },
    ],
    actions: data => {
      // Check if user rejected duplicate creation
      if (data.confirmDuplicate === false) {
        const existingCategory = findExistingComponent(data.componentName);
        const existingDisplay = getCategoryDisplayName(existingCategory);

        return [
          function cancelMessage() {
            return `
❌ Story generation cancelled

Component "${data.componentName}" already exists in:
📂 src/stories/${existingCategory}/${data.componentName}/

💡 Options:
1. Delete existing and regenerate (be careful): rm -rf src/stories/${existingCategory}/${data.componentName}
2. Use a different component name and the same category "${existingDisplay}"
3. Use a different component name and a different category
            `.trim();
          },
        ];
      }

      // Prepare data transformations
      const categoryFolder = data.customCategory || data.category;
      const categoryDisplay = getCategoryDisplayName(categoryFolder);

      const stories = data.includeMultipleStories
        ? ['Default', ...(data.additionalStories || [])]
        : ['Default'];

      // Add computed properties to data using utility functions
      const componentNameWithoutPrefix = stripPrefix(data.componentName);
      const componentNamePascal = toPascalCase(data.componentName);
      const titlePath = `${categoryDisplay}/${componentNameWithoutPrefix}`;

      data.finalCategory = categoryFolder;
      data.categoryDisplay = categoryDisplay;
      data.stories = stories;
      data.hasMultipleStories = stories.length > 1;
      data.componentNamePascal = componentNamePascal;
      data.componentNameWithoutPrefix = componentNameWithoutPrefix;
      data.titlePath = titlePath;
      data.storyDisplayMode = data.storyDisplayMode || 'auto';

      // Check if files already exist
      const baseDir = path.join('src/stories', categoryFolder, data.componentName);
      const storiesPath = path.join(baseDir, `${data.componentName}.stories.ts`);
      const mdxPath = path.join(baseDir, `${data.componentName}.mdx`);
      const storiesExists = fs.existsSync(storiesPath);
      const mdxExists = fs.existsSync(mdxPath);
      const filesAlreadyExist = storiesExists && mdxExists;

      return [
        {
          type: 'add',
          path: 'src/stories/{{finalCategory}}/{{componentName}}/{{componentName}}.stories.ts',
          templateFile: '.plop-templates/story-simple/component.stories.ts.hbs',
          skipIfExists: true,
        },
        {
          type: 'add',
          path: 'src/stories/{{finalCategory}}/{{componentName}}/{{componentName}}.mdx',
          templateFile: '.plop-templates/story-simple/component.mdx.hbs',
          skipIfExists: true,
        },
        // Custom action for post-generation message
        function customAction(answers) {
          const componentDisplay = stripPrefix(answers.componentName);
          const location = `src/stories/${categoryFolder}/${answers.componentName}/`;

          // Different messages based on whether files existed
          if (filesAlreadyExist) {
            return `
⚠️  Story already exists - no changes made

📂 Location: ${location}

The following files were preserved:
- ${answers.componentName}.stories.ts
- ${answers.componentName}.mdx

💡 To regenerate this story:
1. Delete the directory: rm -rf ${location}
2. Run the generator again: pnpm generate:story
            `.trim();
          }

          return `
✨ Story generated successfully!

📂 Location: ${location}

📝 Next steps:
1. Open ${answers.componentName}.stories.ts
2. Define your StoryArgs type (replace TODO)
3. Add argTypes configuration
4. Implement the render function with <${answers.componentName}> component
5. Run 'pnpm dev' to preview in Storybook

💡 Storybook title: ${categoryDisplay}/${componentDisplay}
💡 Component tag: <${answers.componentName}>

See existing stories for implementation examples.
          `.trim();
        },
      ];
    },
  });
}
