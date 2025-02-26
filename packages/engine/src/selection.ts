import {
	ANCHOR,
	ANCHOR_SELECTOR,
	CARD_LEFT_SELECTOR,
	CARD_RIGHT_SELECTOR,
	CARD_SELECTOR,
	CURSOR,
	DATA_ELEMENT,
	FOCUS,
	FOCUS_SELECTOR,
	ROOT_SELECTOR,
} from './constants';
import { EditorInterface, NodeInterface, RangeInterface } from './types';
import { isEdge, isSafari } from './utils';
import { SelectionInterface } from './types/selection';
import { $ } from './node';

class Selection implements SelectionInterface {
	private range: RangeInterface;
	private editor: EditorInterface;
	anchor: NodeInterface | null = null;
	focus: NodeInterface | null = null;

	/**
	 * 移除光标位置占位标签
	 * @param value 需要移除的字符串
	 */
	static removeTags = (value: string) => {
		return value
			.replace(/<anchor\s*\/>/gi, '')
			.replace(/<focus\s*\/>/gi, '')
			.replace(/<cursor\s*\/>/gi, '');
	};

	constructor(editor: EditorInterface, range: RangeInterface) {
		this.editor = editor;
		this.range = range;
	}

	has() {
		return !!this.focus && !!this.anchor;
	}

	create() {
		const { commonAncestorNode, startNode, endNode } = this.range;
		// 超出编辑区域
		if (
			!commonAncestorNode.isEditable() &&
			!commonAncestorNode.inEditor()
		) {
			return;
		}
		const { document } = commonAncestorNode;
		if (!document) return;
		// 为了增加容错性，删除已有的标记
		const root = commonAncestorNode.closest(ROOT_SELECTOR);
		root.find(ANCHOR_SELECTOR).remove();
		root.find(FOCUS_SELECTOR).remove();
		root.find(FOCUS_SELECTOR).remove();
		// card 组件
		const card = startNode.closest(CARD_SELECTOR);
		if (card.length > 0 && !card.isPseudoBlockCard()) {
			const cardLeft = startNode.closest(CARD_LEFT_SELECTOR);
			if (cardLeft.length > 0) {
				this.range.setStartBefore(card);
			}
			const cardRight = startNode.closest(CARD_RIGHT_SELECTOR);
			if (cardRight.length > 0) {
				this.range.setStartAfter(card);
			}
		}

		if (!startNode.equal(endNode)) {
			const card = endNode.closest(CARD_SELECTOR);
			// 具有 block css 属性的行内Card，不调整光标位置
			if (card.length > 0 && !card.isPseudoBlockCard()) {
				const _cardLeft = endNode.closest(CARD_LEFT_SELECTOR);
				if (_cardLeft.length > 0) {
					this.range.setEndBefore(card);
				}
				const _cardRight = endNode.closest(CARD_RIGHT_SELECTOR);
				if (_cardRight.length > 0) {
					this.range.setEndAfter(card);
				}
			}
		}
		// cursor
		if (this.range.collapsed) {
			const cursor = $(document.createElement('span'));
			cursor.attributes(DATA_ELEMENT, CURSOR);
			this.range.insertNode(cursor);
			this.anchor = cursor;
			this.focus = cursor;
			return;
		}
		// anchor
		const startRange = this.range.cloneRange();
		startRange.collapse(true);
		const anchor = $(document.createElement('span'));
		anchor.attributes(DATA_ELEMENT, ANCHOR);
		startRange.insertNode(anchor);
		this.range.setStartAfter(anchor);
		// focus
		const endRange = this.range.cloneRange();
		endRange.collapse(false);
		const focus = $(document.createElement('span'));
		focus.attributes(DATA_ELEMENT, FOCUS);
		endRange.insertNode(focus);
		this.anchor = anchor;
		this.focus = focus;
	}

	move() {
		if (!this.focus || !this.anchor) {
			return;
		}
		const { node } = this.editor;
		if (this.anchor === this.focus) {
			const cursor = this.anchor;
			const _parent = cursor.parent();
			if (!_parent) return;
			node.removeZeroWidthSpace(_parent);
			_parent[0].normalize();

			let isCardCursor = false;
			const prevNode = cursor.prev();
			const nextNode = cursor.next();
			// 具有 block css 属性的行内Card，不调整光标位置
			if (
				prevNode &&
				prevNode.isCard() &&
				!prevNode.isPseudoBlockCard()
			) {
				const cardRight = prevNode.find(CARD_RIGHT_SELECTOR);
				if (cardRight.length > 0) {
					this.range.select(cardRight, true);
					this.range.collapse(false);
					isCardCursor = true;
				}
			} else if (
				nextNode &&
				nextNode.isCard() &&
				!nextNode.isPseudoBlockCard()
			) {
				const cardLeft = nextNode.find(CARD_LEFT_SELECTOR);
				if (cardLeft.length > 0) {
					this.range.select(cardLeft, true);
					this.range.collapse(false);
					isCardCursor = true;
				}
			}

			if (!isCardCursor) {
				this.range.setStartBefore(cursor[0]);
				this.range.collapse(true);
			}

			if (isEdge) {
				_parent![0].normalize();
				cursor.remove();
			} else {
				cursor.remove();
				_parent![0].normalize();
			}
			if (_parent.name === 'p' && _parent.children().length === 0) {
				_parent.append($('<br />'));
			}
			return;
		}
		// collapsed = false
		// range start
		let parent = this.anchor.parent();
		if (parent) {
			node.removeZeroWidthSpace(parent);
			this.range.setStartBefore(this.anchor);
			this.anchor.remove();
			parent[0].normalize();
		}

		// range end
		parent = this.focus.parent();
		if (parent) {
			node.removeZeroWidthSpace(parent);
			this.range.setEndBefore(this.focus);
			this.focus.remove();
			parent[0].normalize();
			if (parent.name === 'p' && parent.children().length === 0) {
				parent.append($('<br />'));
			}
			if (isSafari) {
				const selection = window.getSelection();
				selection?.removeAllRanges();
				selection?.addRange(this.range.base);
			}
		}
	}

	getNode(
		source: NodeInterface,
		position: 'left' | 'center' | 'right' = 'center',
		isClone: boolean = true,
		callback: (node: NodeInterface) => boolean = () => true,
	) {
		const node = isClone ? source.clone(true) : source;
		if (!this.focus || !this.anchor) {
			return node;
		}
		// 删除右侧
		if (position === 'left' || position === 'center') {
			const selectionNode =
				position !== 'center' ? this.anchor : this.focus;
			const focus = $(
				`[${DATA_ELEMENT}=${selectionNode.attributes(DATA_ELEMENT)}]`,
				node.get<Element>(),
			);
			let isRemove = false;
			node.traverse((node) => {
				if (node.equal(focus)) {
					const parent = node.parent();
					focus.remove();
					if (
						parent?.name === 'p' &&
						parent.children().length === 0
					) {
						parent.append($('<br />'));
					}
					isRemove = true;
					return;
				}
				if (isRemove && callback(node)) node.remove();
			}, true);
		}
		// 删除左侧
		if (position === 'right' || position === 'center') {
			const selectionNode =
				position !== 'center' ? this.focus : this.anchor;
			const anchor = $(
				`[${DATA_ELEMENT}=${selectionNode.attributes(DATA_ELEMENT)}]`,
				node.get<Element>(),
			);
			let isRemove = false;
			node.traverse((node) => {
				if (node.equal(anchor)) {
					const parent = node.parent();
					anchor.remove();
					if (
						parent?.name === 'p' &&
						parent.children().length === 0
					) {
						parent.append($('<br />'));
					}
					isRemove = true;
					return;
				}
				if (isRemove && callback(node)) node.remove();
			}, false);
		}
		return node;
	}
}

export default Selection;
