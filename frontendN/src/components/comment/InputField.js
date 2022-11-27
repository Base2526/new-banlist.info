import React, { useContext, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CKEditor } from "ckeditor4-react";
import { useTranslation } from "react-i18next";

import { ActionContext } from "./ActionContext";

let cke = null;

const InputField = (props) => {
  let { cancellor, parentId, child, value, edit, main } = props
  
  const { t } = useTranslation();

  const [text, setText] = useState(value);

  const handleChange = (e) => {
    setText(e.editor.getData())
  };

  const CKEDITORClearData = () =>{
    if(cke) cke.instances.editor1.setData("")
  }

  const actions = useContext(ActionContext);

  return (
    <form
      className={"form"}
      // style={
      //   !child && !edit && main === undefined
      //     ? { marginLeft: 36 }
      //     : { marginLeft: 8 }
      // }
    >
      {/* 
      <div className={"userImg"}>
        <img
          src={actions.userImg}
          style={{ width: 38, height: 38, borderRadius: 38 / 2 }}
          alt='userIcon'
        />
      </div> 
      */}
      <div>
        {/* 
        <TextField
          id="outlined-textarea"
          label="Type your reply here."
          value={text}
          onChange={handleChange}
          multiline
          fullWidth
        /> 
        */}

        <CKEditor
          onBeforeLoad={(CKEDITOR) =>
            {
              cke = CKEDITOR;
              CKEDITOR.addCss(".cke_editable, .cke_editable p {margin: 5;}")
            }
          }
          config={{
            removePlugins: "elementspath",
            resize_enabled: false,
            height: 80,
            toolbar: [
              ["Bold", "Italic", "Strike"],
              [
                "Cut",
                "Copy",
                "Paste",
                "Pasteasplaintext",
                "FormattingStyles",
                "Undo",
                "Redo"
              ],
              ["List", "Blocks", "Align", "Bidi", "Paragraph"],
              ["Find", "Selection", "Spellchecker", "Editing"]
            ],
            extraPlugins: "editorplaceholder",
            editorplaceholder: "Start typing here..."
          }}
          onInstanceReady={ editor => {
            // console.log("onInstanceReady", editor)
          }}
          onChange={handleChange}
          initData={text}
        />
      </div>
      <div className={"inputActions"}>
        <Button
          className={"postBtn"}
          variant="contained"
          disabled={!text}
          style={
            !text
              ? { backgroundColor: "#84dcff" }
              : { backgroundColor: "#30c3fd" }
          }
          onClick={() => {
            edit === true
              ? actions.submit(cancellor, text, parentId, true, setText)
              : actions.submit(cancellor, text, parentId, false, setText);


            CKEDITORClearData()
          }}
        >
          {t("posts")}
        </Button>
        {(text || parentId) && (
          <Button
            className={"cancelBtn"}
            variant="outlined"
            onClick={() =>{
              edit
              ? actions.handleCancel(cancellor, edit)
              : actions.handleCancel(cancellor)

              CKEDITORClearData()
            }}
          >
            {t("cancel")}
          </Button>
        )}
      </div>
    </form>
  );
};

export default InputField;
