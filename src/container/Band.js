import Container from './Container';
import DocElement from '../elements/DocElement';
import Document from '../Document';
import * as utils from '../utils';

/**
 * Standard band container for header, content and footer band.
 * @class
 */
export default class Band extends Container {
    constructor(band, rb) {
        super('', '', rb);
        this.rb = rb;
        this.id = '';
        this.panelItem = null;
        this.name = '';
        this.band = band;
        if (band === Document.band.header) {
            this.id = '0_header';
            this.name = rb.getLabel('bandHeader');
        } else if (band === Document.band.content) {
            this.id = '0_content';
            this.name = rb.getLabel('bandContent');
            this.allowAllElements = true;
        } else if (band === Document.band.footer) {
            this.id = '0_footer';
            this.name = rb.getLabel('bandFooter');
        }
        this.el = null;
    }

    /**
     * Called after initialization is finished.
     */
    setup() {
        this.el = this.rb.getDocument().getElement(this.band);
    }

    appendElement(el) {
        this.el.append(el);
    }

    /**
     * Returns true if the given element type can be added to this container.
     * @param {String} elementType
     */
    isElementAllowed(elementType) {
        if (elementType === DocElement.type.tableText) {
            return false;
        }
        return this.band === Document.band.content ||
            (elementType !== DocElement.type.pageBreak && elementType !== DocElement.type.table);
    }

    /**
     * Update container style when given element type is currently dragged over this container.
     * @param {String} elementType
     */
    dragOver(elementType) {
        if (this.isElementAllowed(elementType)) {
            this.el.addClass('rbroElementDragOver');
        }
    }

    /**
     * Returns absolute container offset.
     * @returns {Object} x and y offset coordinates.
     */
    getOffset() {
        let y = 0;
        let docProperties = this.rb.getDocumentProperties();
        if (this.band === Document.band.content && docProperties.getValue('header')) {
            y = utils.convertInputToNumber(docProperties.getValue('headerSize'));
        } else if (this.band === Document.band.footer) {
            y = this.rb.getDocument().getHeight() - utils.convertInputToNumber(docProperties.getValue('footerSize'));
        }
        return { x: 0, y: y };
    }

    /**
     * Returns container size.
     * @returns {Object} width and height of container.
     */
    getSize() {
        let documentProperties = this.rb.getDocumentProperties();
        let width = documentProperties.getValue('width') -
            documentProperties.getValue('marginLeftVal') - documentProperties.getValue('marginRightVal');
        let height = 0;
        if (this.band === Document.band.header) {
            height = documentProperties.getValue('headerSizeVal');
        } else if (this.band === Document.band.content) {
            height = documentProperties.getValue('height') - documentProperties.getValue('headerSizeVal') -
                documentProperties.getValue('footerSizeVal') -
                documentProperties.getValue('marginTopVal') - documentProperties.getValue('marginBottomVal');
        } else if (this.band === Document.band.footer) {
            height = documentProperties.getValue('footerSizeVal');
        }
        return { width: width, height: height };
    }

    /**
     * Returns true if given absolute position is inside container.
     * @param {Number} x - absolute x coordinate.
     * @param {Number} y - absolute y coordinate.
     */
    isInside(posX, posY) {
        let offset = this.getOffset();
        let size = this.getSize();
        posX -= offset.x;
        posY -= offset.y;
        if (posX >= 0 && posY >= 0 && posX < size.width && posY < size.height) {
            return true;
        }
        return false;
    }
}