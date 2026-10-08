/**
 * Extract readable text from an uploaded medical report.
 *
 * A PDF is not plain text: its content sits in compressed streams, so reading
 * the raw bytes gives garbage. pdf.js parses the document and returns the real
 * text, page by page. It is imported on demand so it only downloads when a
 * user actually analyzes a report.
 *
 * Scanned reports (images, or PDFs that are just pictures of pages) contain no
 * text layer. Reading those would need OCR, which is not supported yet, so we
 * tell the user instead of sending nonsense to the AI.
 */

const MAX_CHARS = 15000 // keep the prompt within the API's request limit

export async function extractReportText(file) {
  if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
    return (await file.text()).slice(0, MAX_CHARS)
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Only text-based PDF or .txt reports are supported. Scanned images need OCR, which is not available yet.')
  }

  const pdfjs = await import('pdfjs-dist')
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise
  const pages = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((item) => item.str).join(' '))
    if (pages.join('\n').length > MAX_CHARS) break
  }

  const text = pages.join('\n').replace(/[ \t]+/g, ' ').trim()
  if (text.length < 20) {
    throw new Error('This PDF has no readable text. It may be a scanned image, which needs OCR.')
  }
  return text.slice(0, MAX_CHARS)
}
