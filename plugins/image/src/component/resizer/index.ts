import { EditorInterface, NodeInterface, EventListener } from '@aomao/engine';
import './index.css';

export type Options = {
	src: string;
	width: number;
	height: number;
	maxWidth: number;
	rate: number;
	onChange?: (size: Size) => void;
};

export type Position =
	| 'right-top'
	| 'left-top'
	| 'right-bottom'
	| 'left-bottom';

export type Point = {
	x: number;
	y: number;
};

export type Size = {
	width: number;
	height: number;
};

class Resizer {
	private editor: EditorInterface;
	private options: Options;
	private root: NodeInterface;
	private image: NodeInterface;
	private resizerNumber: NodeInterface;
	private point: Point = { x: 0, y: 0 };
	private position?: Position;
	private size: Size;
	maxWidth: number;
	/**
	 * 是否改变大小中
	 */
	private resizing: boolean = false;

	constructor(editor: EditorInterface, options: Options) {
		this.editor = editor;
		this.options = options;
		this.root = this.editor.$(this.renderTemplate(options.src));
		this.image = this.root.find('img');
		this.resizerNumber = this.root.find('.data-image-resizer-number');
		const { width, height } = this.options;
		this.size = {
			width,
			height,
		};
		this.maxWidth = this.options.maxWidth;
	}

	renderTemplate(src: string) {
		return `
        <div class="data-image-resizer">
            <img class="data-image-resizer-bg data-image-resizer-bg-active" src="${src}" />
            <div class="data-image-resizer-holder data-image-resizer-holder-right-top"></div>
            <div class="data-image-resizer-holder data-image-resizer-holder-right-bottom"></div>
            <div class="data-image-resizer-holder data-image-resizer-holder-left-bottom"></div>
            <div class="data-image-resizer-holder data-image-resizer-holder-left-top"></div>
            <span class="data-image-resizer-number"></span>
        </div>`;
	}

	onMouseDown(event: MouseEvent, position: Position) {
		if (this.resizing) return;
		event.preventDefault();
		event.stopPropagation();
		this.root.css(
			'top',
			['right-top', 'left-top'].indexOf(position) > -1 ? 'auto' : 0,
		);
		this.root.css(
			'left',
			['left-top', 'left-bottom'].indexOf(position) > -1 ? 'auto' : 0,
		);
		this.root.css(
			'bottom',
			['right-bottom', 'left-bottom'].indexOf(position) > -1 ? 'auto' : 0,
		);
		this.root.css(
			'right',
			['right-top', 'right-bottom'].indexOf(position) > -1 ? 'auto' : 0,
		);
		this.point = {
			x: event.clientX,
			y: event.clientY,
		};
		this.position = position;
		this.resizing = true;
		this.resizerNumber.addClass(
			`data-image-resizer-number-${this.position}`,
		);
		this.resizerNumber.addClass('data-image-resizer-number-active');
		this.image.show();
		document.addEventListener('mousemove', this.onMouseMove);
		document.addEventListener('mouseup', this.onMouseUp);
	}

	onMouseMove = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const { clientX, clientY } = event;

		if (clientX !== this.point.x || clientY !== this.point.y) {
			//移动后的宽度
			const width = this.point.x - clientX;
			//移动后的高度
			const height = this.point.y - clientY;
			this.updateSize(width, height);
		}
		this.resizing = true;
	};

	onMouseUp = (event: MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
		const root = this.root.get<HTMLElement>();
		if (!root) return;
		const { clientWidth, clientHeight } = root;
		this.size = {
			width: clientWidth,
			height: clientHeight,
		};
		this.resizerNumber.removeClass(
			`data-image-resizer-number-${this.position}`,
		);
		this.resizerNumber.removeClass('data-image-resizer-number-active');
		this.position = undefined;
		this.resizing = false;

		document.removeEventListener('mousemove', event =>
			this.onMouseMove(event),
		);
		document.removeEventListener('mouseup', this.onMouseUp);
		const { onChange } = this.options;
		if (onChange) onChange(this.size);
		this.image.hide();
	};

	updateSize(width: number, height: number) {
		if (['right-top', 'right-bottom'].indexOf(this.position || '') > -1) {
			width = this.size.width - width;
		} else {
			width = this.size.width + width;
		}
		if (width < 24) {
			width = 24;
		}
		const { rate } = this.options;
		if (width > this.maxWidth) {
			width = this.maxWidth;
		}

		height = width * rate;
		if (height < 24) {
			height = 24;
			width = height / rate;
		}
		width = Math.round(width);
		height = Math.round(height);
		this.setSize(width, height);
	}

	setSize(width: number, height: number) {
		this.root.css({
			width: width + 'px',
			height: height + 'px',
		});
		this.resizerNumber.html(`${width}\xB7${height}`);
	}

	on(eventType: string, listener: EventListener) {
		this.image.on(eventType, listener);
	}

	off(eventType: string, listener: EventListener) {
		this.image.off(eventType, listener);
	}

	render() {
		const { width, height } = this.options;
		this.root.css({
			width: `${width}px`,
			height: `${height}px`,
		});

		this.root
			.find('.data-image-resizer-holder-right-top')
			.on('mousedown', event => {
				return this.onMouseDown(event, 'right-top');
			});
		this.root
			.find('.data-image-resizer-holder-right-bottom')
			.on('mousedown', event => {
				return this.onMouseDown(event, 'right-bottom');
			});
		this.root
			.find('.data-image-resizer-holder-left-bottom')
			.on('mousedown', event => {
				return this.onMouseDown(event, 'left-bottom');
			});
		this.root
			.find('.data-image-resizer-holder-left-top')
			.on('mousedown', event => {
				return this.onMouseDown(event, 'left-top');
			});
		return this.root;
	}

	destroy() {
		this.root.remove();
		document.removeEventListener('mousemove', this.onMouseMove);
		document.removeEventListener('mouseup', this.onMouseUp);
	}
}

export default Resizer;
