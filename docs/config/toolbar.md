# Toolbar configuration

Introduce the toolbar

```ts
//vue please use @aomao/toolbar-vue
import Toolbar, { ToolbarPlugin, ToolbarComponent } from '@aomao/toolbar';
```

-Toolbar Toolbar component
-ToolbarPlugin provides plugins to the engine
-ToolbarComponent provides the card component to the engine

Except for the `Toolbar` component, the latter two are shortcuts to realize the toolbar card plug-in option when you press `/` in the editor

## Types of

There are now four ways to display the toolbar

-`button` button -`downdrop` drop-down box -`color` color palette -`collapse` drop-down panel, the drop-down box that appears on the first button of the toolbar, and card-form components are basically placed here

## Attributes

The attributes that the Toolbar component needs to pass in:

-An instance of the `editor` editor, which can be used to automatically invoke the plug-in execution -`items` plugin display configuration list

## Configuration item

items is a two-dimensional array. We can put plugins of the same concept in a group for easy searching. After rendering, each group will be separated by a dividing line

```ts
items: [['collapse'], ['bold', 'italic']];
```

All the display forms of the existing plug-ins have been configured in the Toolbar component, and we can directly pass in the plug-in name to use these configurations. Of course, we can also pass in an object to cover part of the configuration

```ts
items: [
	['collapse'],
	[
		{
			name: 'bold',
			icon: 'icon',
			title: 'Prompt text',
		},
		'italic',
	],
];
```

If the default configuration is found through the `name` attribute, the `type` attribute will not be overwritten. If the configured `name` is not part of the default configuration, it will be processed according to the custom button

## Collapse

Usually used to configure the card drop-down box

Need to specify `type` as `collapse`

### className

Custom style name

### icon

Optional

The button icon, which can be a React component, or a string of html in Vue

### content

Optional

Button display content, will be displayed together with icon

It can be a React component, or it can be a string of html in Vue. Or a method, and return React component or html string

### onSelect

List item selected event, return `false`, the default command of list item configuration will not be executed

```ts
onSelect?: (event: React.MouseEvent, name: string) => void | boolean;
```

### groups

Group display

The `groups` property can be set to classify cards for different purposes as needed

If `title` is not filled in, the grouping style will not appear

```ts
// Display group information
items: [
	[
		{
			type: 'collapse',
			groups: [
				{
					title: 'File',
					items: ['image-uploader', 'file-uploader'],
				},
			],
		},
	],
];

// or do not display group information

items: [
	[
		{
			type: 'collapse',
			groups: [
				{
					items: ['bold', 'underline'],
				},
			],
		},
	],
];
```

### items

Configure `items` of `collapse`

The following cards have been configured by default

```ts
'image-uploader',
'codeblock',
'table',
'file-uploader',
'video-uploader',
'math',
'status',
```

We can specify `name` as the name of an existing card, and configure other options to override the default configuration.

Of course, we can also specify other names to complete custom `item`

```ts
items: [
	[
		{
			type: 'collapse',
			groups: [
				{
					items: [{ name: 'codeblock', content: 'I am CodeBlock' }],
				},
			],
		},
	],
];
```

The basic properties are the same as the `button` properties, which can be viewed in the following part of the article, here are the special properties relative to the `button`

#### search

To query characters, in the toolbar plug-in, we can use `/` to call up shortcut options in the editor, and search for related cards, so you can specify a combination of related keywords and characters here

#### description

List item description, can return a `React` component, or `Vue` can return `html` string

#### prompt

The content that needs to be rendered when the mouse is moved into the list item can return a `React` component, or `Vue` can return a `html` string

The effect is similar to the `table` card item. After the input is moved in, a table with selected columns and rows will be displayed

#### onClick

List item click event, return `false` will not execute the configured default command

```ts
onClick?: (event: React.MouseEvent, name: string) => void | boolean;
```

## Button

button configuration properties

Configure in the toolbar items, you need to specify the `type` as `button`

```ts
items:[
    [
        {
            type:'button',
            name:'test',
            ...
        }
    ]
]
```

### name

Button name

If the button name is the same as the toolbar default configuration item name, then the default configuration will be overwritten, otherwise it will be used as a custom button

### icon

Optional

The button icon, which can be a React component, or a string of html in Vue

### content

Optional

Button display content, will be displayed together with icon

It can be a React component, or it can be a string of html in Vue. Or a method, and return React component or html string

### title

The prompt message displayed when the mouse moves into the button

### placement

Set the location of the prompt message

```ts
placement?:
    |'right'
    |'top'
    |'left'
    |'bottom'
    |'topLeft'
    |'topRight'
    |'bottomLeft'
    |'bottomRight'
    |'leftTop'
    |'leftBottom'
    |'rightTop'
    |'rightBottom';
```

### hotkey

Whether to display the hot key, or set the information of the hot key

The default is to display the hotkey to the prompt message (`title`), and use the `name` information to find the hotkey set by the plug-in

```ts
hotkey?: boolean | string;
```

### autoExecute

When the button is clicked, whether to automatically execute the plug-in command, it is enabled by default

### command

Plug-in command or parameter

If this parameter is configured and the `autoExecute` property is enabled, when the button is clicked, this configuration is called to execute the plug-in command

If `name` is configured, execute the plugin corresponding to `name`, otherwise execute the plugin corresponding to `name` specified by `button`

If there is a configuration of `args` or `command` as a pure array, it will be passed as a parameter to the command to execute the plugin

```ts
command?: {name: string; args: Array<any>} | Array<any>;
```

### className

Configure the style name for the button

### onClick

Mouse click event

If it returns false, the plugin command will not be executed automatically

```ts
onClick?: (event: React.MouseEvent) => void | boolean;
```

### onMouseDown

Mouse button press event

```ts
onMouseDown?: (event: React.MouseEvent) => void;
```

### onMouseEnter

Mouse in button event

```ts
onMouseEnter?: (event: React.MouseEvent) => void;
```

### onMouseLeave

Mouse off button event

```ts
onMouseLeave?: (event: React.MouseEvent) => void;
```

### onActive

The custom button is activated and selected, and the plug-in `engine.command.queryState` method is called by default

```ts
onActive?: () => boolean;
```

### onDisabled

The custom button is disabled, and the plugin `engine.command.queryEnabled` is called by default

```ts
onDisabled?: () => boolean;
```

## Dropdown

dropdown configuration properties

Configure in the toolbar items, you need to specify `type` as `dropdown`

```ts
items:[
    [
        {
            type:'dropdown',
            name:'test',
            items: [
                {
                    key:'item1',
                    content:'item1'
                }
            ]
            ...
        }
    ]
]
```

### items

Drop-down list items, similar to buttons

```ts
items:[{
    key: string;
    icon?: React.ReactNode;
    content?: React.ReactNode | (() => React.ReactNode);
    hotkey?: boolean | string;
    isDefault?: boolean;
    title?: string;
    placement?:
        |'right'
        |'top'
        |'left'
        |'bottom'
        |'topLeft'
        |'topRight'
        |'bottomLeft'
        |'bottomRight'
        |'leftTop'
        |'leftBottom'
        |'rightTop'
        |'rightBottom';
    className?: string;
    disabled?: boolean;
    command?: {name: string; args: Array<any>} | Array<any>;
    autoExecute?: boolean;
}]
```

### name

Drop-down list name

If the name is the same as the toolbar default configuration item name, then the default existing configuration will be overwritten, otherwise it will be used as a custom drop-down list

### icon

Optional

The button icon, which can be a React component, or a string of html in Vue

### content

Optional

Button display content, will be displayed together with icon

It can be a React component, or it can be a string of html in Vue. Or a method, and return React component or html string

### title

The prompt message displayed when the mouse moves into the button

### values

The selected value in the drop-down list is obtained by `engine.command.queryState` by default. If there is a configuration of `onActive`, the value will be obtained from the custom `onActive`

```ts
values?: string | Array<string>;
```

### single

Single selection or multiple selection

```ts
single?: boolean;
```

### className

Drop-down list style

### direction

Arrangement direction `vertical` | `horizontal`

```ts
direction?:'vertical' |'horizontal';
```

### onSelect

List item selection event, return `false` will not automatically execute the command configured for the selected item

```ts
onSelect?: (event: React.MouseEvent, key: string) => void | boolean;
```

### hasArrow

Whether to show the drop-down arrow

```ts
hasArrow?: boolean;
```

### hasDot

Whether to display the check effect after the selected value

```ts
hasDot?: boolean;
```

### renderContent

Custom render the content displayed after the drop-down list is selected, the default is the `icon` or `content` configured by the drop-down list

Can return React components or Vue can return html strings

```ts
renderContent?: (item: DropdownListItem) => React.ReactNode;
```

### onActive

The custom button is activated and selected, and the plug-in `engine.command.queryState` method is called by default

```ts
onActive?: () => boolean;
```

### onDisabled

The custom button is disabled, and the plugin `engine.command.queryEnabled` is called by default

```ts
onDisabled?: () => boolean;
```

## Default configuration of all plugins

```ts
[
	['collapse'],
	['undo', 'redo', 'paintformat', 'removeformat'],
	['heading', 'fontfamily', 'fontsize'],
	['bold', 'italic', 'strikethrough', 'underline', 'moremark'],
	['fontcolor', 'backcolor'],
	['alignment'],
	['unorderedlist', 'orderedlist', 'tasklist', 'indent', 'line-height'],
	['link', 'quote', 'hr'],
];
```

These default configuration details can be found here:

React: [https://github.com/yanmao-cc/am-editor/blob/master/packages/toolbar/src/config/toolbar/index.tsx](https://github.com/yanmao-cc/am-editor/blob/master/packages/toolbar/src/config/toolbar/index.tsx)
Vue: [https://github.com/yanmao-cc/am-editor/blob/master/packages/toolbar-vue/src/config/index.ts](https://github.com/yanmao-cc/am-editor/blob/master/packages/toolbar-vue/src/config/index.ts)
