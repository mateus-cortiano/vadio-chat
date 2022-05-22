/* eventsystem.ts */

type EventMap<Events> = {
  [Prop in keyof Events]: Events[Prop]
}

interface ListenerFlags {
  once?: boolean
}

interface Listener<T> {
  callback: T
  flags: ListenerFlags
}

export interface BaseEvents {
  connect: (username: string) => void
  disconnect: (reason: string) => void
}

export class EventSystem<Events extends EventMap<Events> = BaseEvents> {
  private subscribers: Map<keyof Events, Listener<Events[keyof Events]>[]>

  constructor() {
    this.subscribers = new Map()
  }

  private setdefault(event: keyof Events) {
    let subs = this.subscribers.get(event)
    if (subs === undefined) {
      this.subscribers.set(event, [])
      subs = this.subscribers.get(event)
    }
    return subs as Listener<Events[keyof Events]>[]
  }

  on<Ev extends keyof Events>(event: Ev, callback: Events[Ev]) {
    this.setdefault(event).push({ callback: callback, flags: {} })
    return () => this.remove(event, callback)
  }

  emit<Ev extends keyof Events>(event: Ev, ...data: Parameters<Events[Ev]>) {
    let subs = this.subscribers.get(event)

    if (subs === undefined) return

    let remove_after: Listener<Events[keyof Events]>[] = []

    for (let sub of subs) {
      sub.callback(...(data as Events[Ev][]))
      if (sub.flags.once) remove_after.push(sub)
    }

    for (let sub of remove_after) this.remove(event, sub)
  }

  remove<Ev extends keyof Events>(
    event: Ev,
    listener: Listener<Events[keyof Events]>
  ) {
    let subs = this.subscribers.get(event)
    if (subs === undefined) return
    subs.splice(subs.indexOf(listener))
  }
}
