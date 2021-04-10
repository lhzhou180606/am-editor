import isHotkey from 'is-hotkey';
import {
	EngineInterface,
	TypingHandle,
	TypingHandleInterface,
	TypingInterface,
} from '../types';
import keydownDefaultHandles from './keydown';
import keyupDefaultHandles from './keyup';

class Typing implements TypingInterface {
	private engine: EngineInterface;
	private handleListeners: Array<{
		name: string;
		triggerName?: string;
		triggerParams?:
			| any
			| ((engine: EngineInterface, event: KeyboardEvent) => any);
		handle: TypingHandleInterface;
	}> = [];
	constructor(engine: EngineInterface) {
		this.engine = engine;
		keydownDefaultHandles.concat(keyupDefaultHandles).forEach(handle => {
			this.addHandleListener(
				handle.name,
				handle.handle,
				handle.triggerName,
			);
		});
		this.engine.container.on('keydown', (e: KeyboardEvent) =>
			this.bindKeydown(e),
		);
		this.engine.container.on('keyup', (e: KeyboardEvent) =>
			this.bindKeyup(e),
		);
	}

	addHandleListener(
		name: string,
		handle: TypingHandle,
		triggerName?: string,
		triggerParams?:
			| any
			| ((engine: EngineInterface, event: KeyboardEvent) => any),
	): void {
		this.handleListeners.push({
			name,
			handle: new handle(this.engine),
			triggerName,
			triggerParams,
		});
	}

	getHandleListener(
		name: string,
		type: 'keydown' | 'keyup',
	): TypingHandleInterface | undefined {
		return this.handleListeners.find(
			listener => listener.name === name && listener.handle.type === type,
		)?.handle;
	}

	removeHandleListener(name: string, type: 'keydown' | 'keyup'): void {
		for (let i = 0; i < this.handleListeners.length; i++) {
			if (
				this.handleListeners[i].name === name &&
				this.handleListeners[i].handle.type === type
			) {
				this.handleListeners[i].handle.destroy();
				this.handleListeners.splice(i, 1);
				break;
			}
		}
	}

	bindKeydown(event: KeyboardEvent) {
		//只读状态
		if (this.engine.readonly) {
			//全选禁止默认事件触发
			if (isHotkey('mod+a', event)) event.preventDefault();
			return;
		}
		//跳过卡片
		if (event.target && this.engine.card.find(this.engine.$(event.target)))
			return;
		this.trigger('keydown', event);
	}

	bindKeyup(event: KeyboardEvent) {
		//只读状态
		if (this.engine.readonly) return;
		//跳过卡片
		if (event.target && this.engine.card.find(this.engine.$(event.target)))
			return;
		this.trigger('keyup', event);
	}

	trigger(type: 'keydown' | 'keyup', event: KeyboardEvent) {
		//循环事件
		const result = this.handleListeners
			.filter(({ handle }) => handle.type === type)
			.some(listener => {
				const { name, handle, triggerName, triggerParams } = listener;
				if (name === 'default' || !!!handle.hotkey) return false;
				if (
					typeof handle.hotkey === 'function'
						? handle.hotkey(event)
						: isHotkey(handle.hotkey, event)
				) {
					let params = [event];
					if (typeof triggerParams === 'function')
						params = triggerParams(this.engine, event);
					if (
						!triggerName ||
						this.engine.trigger(triggerName, ...params) !== false
					) {
						handle.trigger(event);
					}
					return true;
				}
				return false;
			});
		//触发默认事件
		if (result === false) {
			this.getHandleListener('default', type)?.trigger(event);
		}
	}
}
export default Typing;
