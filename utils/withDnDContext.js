import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import makeFolderAwareHTML5Backend from '_core/utils/makeFolderAwareHTML5Backend.utils';

export default DragDropContext(makeFolderAwareHTML5Backend(HTML5Backend));
