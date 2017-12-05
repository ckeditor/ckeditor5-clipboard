/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module clipboard/pastecommand
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import plainTextToHtml from './utils/plaintexttohtml';
import normalizeClipboardHtml from './utils/normalizeclipboarddata';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

/**
 * The paste command. It is used by the {@link module:clipboard/clipboard~Clipboard clipboard feature}.
 *
 * @extends module:core/command~Command
 */
export default class PasteCommand extends Command {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		/**
		 * Data processor used to convert pasted HTML to a view structure.
		 *
		 * @private
		 * @member {module:engine/dataprocessor/htmldataprocessor~HtmlDataProcessor} #_htmlDataProcessor
		 */
		this._htmlDataProcessor = new HtmlDataProcessor();

		this.decorate( 'input' );
	}

	/**
	 * @fires execute
	 */
	execute( data ) {
		const dataTransfer = data.dataTransfer;
		let content = '';

		if ( dataTransfer.getData( 'text/html' ) ) {
			content = normalizeClipboardHtml( dataTransfer.getData( 'text/html' ) );
		} else if ( dataTransfer.getData( 'text/plain' ) ) {
			content = plainTextToHtml( dataTransfer.getData( 'text/plain' ) );
		}

		content = this._htmlDataProcessor.toView( content );

		this.input( { content } );
		this.editor.editing.view.scrollToTheSelection();
	}

	input( data ) {
		if ( !data.content.isEmpty ) {
			const dataController = this.editor.data;
			const model = this.editor.model;

			model.change( () => {
				// Convert the pasted content to a model document fragment.
				// Conversion is contextual, but in this case we need an "all allowed" context and for that
				// we use the $clipboardHolder item.
				const modelFragment = dataController.toModel( data.content, '$clipboardHolder' );

				if ( modelFragment.childCount == 0 ) {
					return;
				}

				dataController.insertContent( modelFragment, model.document.selection );
			} );
		}
	}
}
