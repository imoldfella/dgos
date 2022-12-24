
// having the interface in a separate file lets you keep it the same on both sides

export interface DgguiShared {
    double(_: number): number
}

// use like this 
// const x = 