import { User } from "../../types/User";
import service from "../../axios";
import { Message } from "../../types/Message";

export function getUsersApi() {
  return service.get<User[]>('/messages/users')
}

export function getMessagesApi(userId: string) {
  return service.get<Message[]>(`/messages/${userId}`)
}

export function sendMessageApi(userId: string, messageData: { text: string; image: string }) {
  return service.post<Message>(`/messages/send/${userId}`, {data: messageData})
}
