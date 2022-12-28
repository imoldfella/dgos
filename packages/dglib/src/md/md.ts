import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import rehypeSlug from 'rehype-slug'


// convert markdown to html
export async function md2html(md: string): Promise<string> {
    const file = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeStringify)
        .use(rehypeSlug)
        .process(md ?? "error")
    return String(file)
}

export function buildToc(contentDiv: HTMLElement, $aside: HTMLElement) {
    const $headings: Element[] = [...contentDiv.querySelectorAll('h1, h2')];
    const linkHtml = generateLinkMarkup($headings as HTMLElement[]);
    $aside.innerHTML = linkHtml

    const $links = [...$aside.querySelectorAll('a')]
    const observer = createObserver($links)
    $headings.map(heading => observer.observe(heading))
}

// https://codepen.io/lisilinhart/pen/NWrrNpV
interface Head {
    title: string
    depth: number
    id: string
}
export function generateLinkMarkup($headings: HTMLElement[]) {
    const parsedHeadings = $headings.map(heading => {
        return {
            title: heading.innerText,
            depth: parseInt(heading.nodeName.replace(/\D/g, '')),
            id: heading.getAttribute('id')
        }
    })
    // use jsx here for better typing?
    const htmlMarkup = parsedHeadings.map(h => `
      <li class="dark:hover:text-white hover:underline header-link ${h.depth > 1 ? 'pl-4' : 'pl-2'}">
          <a class="" href="#${h.id}">${h.title}</a>
      </li>
      `)
    const finalMarkup = `
          <ul class=' leading-6'>${htmlMarkup.join('')}</ul>
      `
    return finalMarkup
}

function updateLinks(visibleId: string, $links: HTMLElement[]) {
    $links.map(link => {
        let href = link.getAttribute('href')
        link.classList.remove('is-active')
        if (href === visibleId) link.classList.add('is-active')
    })
}

function handleObserver(entries: any[], observer: any, $links: HTMLElement[]) {
    entries.forEach((entry: any) => {
        const { target, isIntersecting, intersectionRatio } = entry
        if (isIntersecting && intersectionRatio >= 1) {
            const visibleId = `#${target.getAttribute('id')}`
            updateLinks(visibleId, $links)
        }
    })
}

function createObserver($links: HTMLElement[]) {
    const options = {
        rootMargin: "0px 0px -200px 0px",
        threshold: 1
    }
    const callback: IntersectionObserverCallback = (e, o: IntersectionObserverInit) => handleObserver(e, o, $links)
    return new IntersectionObserver(callback, options)
}

