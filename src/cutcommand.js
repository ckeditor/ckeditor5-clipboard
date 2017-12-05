/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module clipboard/copycommand
 */

import CopyCommand from './copycommand';

/**
 * The copy command. It is used by the {@link module:clipboard/clipboard~Clipboard clipboard feature}.
 *
 * @extends module:core/command~Command
 */
export default class CutCommand extends CopyCommand {
	constructor( editor ) {
		super( editor );

		this.type = 'cut';
	}

	output( data ) {
		super.output( data );

		const editor = this.editor;
		const model = this.editor.model;

		model.change( () => {
			editor.data.deleteContent( model.document.selection );
		} );
	}
}
