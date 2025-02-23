import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const DescriptionEditor = ({ value, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event, editor) => onChange(editor.getData())}
        />
    );
};

export default DescriptionEditor;
