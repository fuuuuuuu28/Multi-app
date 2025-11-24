export type Message = {
    _id:string,
    senderId:string,
    receiverId:string,
    content:string,
    createdAt:string,
    updatedAt:string,
}

export type User = {
    _id:string,
    clerkId:string,
    fullName:string,
    image: string,
    lastMessage: Message,
    lastMessageAt: Date,
}

export type Todo = {
    _id:string,
    task:string,
    completed:boolean,
}

export type Texts = {
    role:string,
    text:string,
}