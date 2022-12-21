import { faker } from "@faker-js/faker"
import { Tabx } from "./data"


// we should start with just datagrove, and then when that starts allow it to seach for sites to add.
export function exampleList() {
    let r: Tabx[] = []
    for (let i = 0; i < 100; i++) {
        r.push({
            rid: `${i}`,
            level: 0,
            name: faker.internet.domainName(),
            avatar: faker.image.avatar(),
            count: 2,
            selected: false
        })
    }
    return r
}
