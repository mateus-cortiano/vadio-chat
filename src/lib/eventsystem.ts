/* eventsystem.ts */

import { EventEmitter } from 'stream'

type Callback<Data> = (...args: Data[] | any[]) => void
export type EventMap = { [key: symbol]: (...args: any[]) => void }
export type GenericEventMap<T, Data> = {
  [Prop in keyof T]: T[Prop] extends Callback<Data> ? Callback<Data> : never
}

export class EventsSystem<
  Events extends GenericEventMap<Events, Data>,
  Data = (...args: any[]) => void
> {
  private subscribers: Map<keyof Events, Events[keyof Events][]>

  constructor() {
    this.subscribers = new Map()
  }

  public on(event: keyof Events, callback: Events[keyof Events]) {
    this.setdefault(event).push(callback)
    return () => this.remove(event, callback)
  }

  public emit(event: keyof Events, ...data: Data[] | any[]) {
    let subs = this.get(event, [])
    for (let sub of subs) sub(...data)
  }

  private get<T>(
    event: keyof Events,
    ordefault: T = undefined
  ): Events[keyof Events][] | T {
    let subs = this.subscribers.get(event)
    if (subs === undefined) return ordefault
    return subs
  }

  private setdefault(event: keyof Events): Events[keyof Events][] {
    let subs = this.subscribers.get(event)
    if (subs === undefined) {
      this.subscribers.set(event, [])
      subs = this.subscribers.get(event)
    }
    return subs
  }

  public remove(event: keyof Events, callback: Events[keyof Events]) {
    let subs = this.subscribers.get(event)
    if (subs === undefined) return
    subs.splice(subs.indexOf(callback))
  }
}
