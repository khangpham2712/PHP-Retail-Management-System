import React from 'react'
import cellPlugins from "../../../views/ManagerView/Setting/WebSetting/util"

import Editor from '@react-page/editor'

import "@react-page/editor/lib/index.css";
import "@react-page/plugins-image/lib/index.css";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-slate/lib/index.css";

const AboutUsPage = ({webInfo}) => {

    return (
        <div>
           <Editor
            cellPlugins={cellPlugins}
            value={webInfo.other.detail}
            readOnly={true}
            />
        </div>
    )
}

export default AboutUsPage
