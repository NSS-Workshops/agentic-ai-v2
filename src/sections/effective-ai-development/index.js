/*
  Section configuration file
*/

// Import all chapter packages. This is a Vite feature.
const chapterModules = import.meta.glob('./*/index.js', { eager: true })

// Section configuration. This is the only code you change.
const config = {
  id: "effective-ai-development",
  title: "Effective AI Development",
  description: "Patterns and workflows for controlled AI-assisted development",
  order: 2,
}

// Create chapters array
const chapters = Object.values(chapterModules).map(chapter => {
  const chapterExport = Object.values(chapter)[0]
  chapterExport.sectionId = config.id
  return chapterExport
})

export { chapters, config }
