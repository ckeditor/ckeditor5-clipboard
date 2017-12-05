/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module clipboard/copycommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import viewToPlainText from './utils/viewtoplaintext.js';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

/**
 * The copy command. It is used by the {@link module:clipboard/clipboard~Clipboard clipboard feature}.
 *
 * @extends module:core/command~Command
 */
export default class CopyCommand extends Command {
	constructor( editor ) {
		super( editor );

		/**
		 * Data processor used to convert pasted HTML to a view structure.
		 *
		 * @private
		 * @member {module:engine/dataprocessor/htmldataprocessor~HtmlDataProcessor} #_htmlDataProcessor
		 */
		this._htmlDataProcessor = new HtmlDataProcessor();

		this.type = 'copy';

		this.decorate( 'output' );
	}

	/**
	 * @fires execute
	 */
	execute( data ) {
		const editor = this.editor;
		const model = editor.model;
		const dataTransfer = data.dataTransfer;

		data.preventDefault();

		model.change( () => {
			const content = editor.data.toView( editor.data.getSelectedContent( model.document.selection ) );

			this.output( { dataTransfer, content, method: this.type } );
		} );
	}

	output( data ) {
		if ( !data.content.isEmpty ) {
			data.dataTransfer.setData( 'text/html', this._htmlDataProcessor.toData( data.content ) );
			data.dataTransfer.setData( 'text/plain', viewToPlainText( data.content ) );
		}
	}
}
