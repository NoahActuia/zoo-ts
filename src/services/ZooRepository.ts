export class ZooRepository<T> {
	private items = new Map<string, T>();

	add(id: string, item: T): void {
		this.items.set(id, item);
	}

	get(id: string): T | undefined {
		return this.items.get(id);
	}

	getAll(): T[] {
		return [...this.items.values()];
	}
}
