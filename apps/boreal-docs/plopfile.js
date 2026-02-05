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
          'Actions',
          'Images & Icons',
          'Feedback',
          'Forms',
          'Data Visualization',
          'Helpers',
          'Overlays',
          'Patterns',
          'Title & Text',
          'Navigation',
          'Charts',
          { name: 'Other (custom)', value: '__custom__' },
        ],
        default: 'Actions',
      },
      {
        type: 'input',
        name: 'customCategory',
        message: 'Enter custom category name:',
        when: answers => answers.category === '__custom__',
        validate: value => {
          if (!value) return 'Category is required';
          if (!/^[a-zA-Z0-9\s&-]+$/.test(value)) {
            return 'Category should only contain letters, numbers, spaces, & and -';
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
        message: 'Story names (comma-separated, e.g., "Disabled, Loading, WithIcon"):',
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
    ],
    actions: data => {
      // Prepare data transformations
      const category = data.customCategory || data.category;
      const stories = data.includeMultipleStories
        ? ['Default', ...(data.additionalStories || [])]
        : ['Default'];

      // Add computed properties to data using utility functions
      const componentNameWithoutPrefix = stripPrefix(data.componentName);
      const componentNamePascal = toPascalCase(data.componentName);
      const titlePath = `${category}/${componentNameWithoutPrefix}`;

      data.finalCategory = category;
      data.stories = stories;
      data.hasMultipleStories = stories.length > 1;
      data.componentNamePascal = componentNamePascal;
      data.componentNameWithoutPrefix = componentNameWithoutPrefix;
      data.titlePath = titlePath;
      data.storyDisplayMode = data.storyDisplayMode || 'auto';

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
          return `
✨ Story generated successfully!

📂 Location: src/stories/${category}/${answers.componentName}/

📝 Next steps:
1. Open ${answers.componentName}.stories.ts
2. Define your StoryArgs type (replace TODO)
3. Add argTypes configuration
4. Implement the render function with <${answers.componentName}> component
5. Run 'pnpm dev' to preview in Storybook

💡 Storybook title: ${category}/${componentDisplay}
💡 Component tag: <${answers.componentName}>

See existing stories (Button, Icons) for implementation examples.
          `.trim();
        },
      ];
    },
  });
}
