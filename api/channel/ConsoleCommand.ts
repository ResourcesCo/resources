import ConsoleMessage from './ConsoleMessage'

export default interface ConsoleCommand {
  messages: ConsoleMessage[]
  [key: string]: any
}
