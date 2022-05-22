/* eventsystem.ts */

export type EventMap<Events> = {
  [Prop in keyof Events]: Events[Prop]
}

export interface BaseEvents {
  connect: (username: string) => void
  disconnect: (reason: string) => void
}

export class EventSystem<Events extends EventMap<Events> = BaseEvents> {
  private subscribers: Map<keyof Events, Events[keyof Events][]>

  constructor() {
    this.subscribers = new Map()
  }

  private setdefault(event: keyof Events) {
    let subs = this.subscribers.get(event)
    if (subs === undefined) {
      this.subscribers.set(event, [])
      subs = this.subscribers.get(event)
    }
    return subs as Events[keyof Events][]
  }

  on<Ev extends keyof Events>(event: Ev, callback: Events[Ev]) {
    this.setdefault(event).push(callback)
    return () => this.remove(event, callback)
  }

  emit<Ev extends keyof Events>(event: Ev, ...data: Parameters<Events[Ev]>) {
    let subs = this.subscribers.get(event)
    if (subs === undefined) return
    for (let sub of subs) sub(...(data as Events[Ev][]))
  }

  remove<Ev extends keyof Events>(event: Ev, callback: Events[Ev]) {
    let subs = this.subscribers.get(event)
    if (subs === undefined) return
    subs.splice(subs.indexOf(callback))
  }
}
