import React from "react";

const NoteForm = (props) => {
    const {FormTitle, title, content, titleChanged, contentChangend, submitClicked, submitText} = props;

    return (
        <div>
            <h2>{FormTitle}</h2>
            <div>
                <input
                    type="text"
                    name="title"
                    className="form-input mb-30"
                    placeholder="العنوان"
                    value={title}
                    onChange={titleChanged}
                />
                
                <textarea
                    rows="10"
                    name="content"
                    className="form-input"
                    placeholder="النص"
                    value={content}
                    onChange={contentChangend}
                />
                <a href="#" className="button green" onClick={submitClicked}>{submitText}</a>
            </div>
        </div>
    )
} 

export default NoteForm;