import React, {useState} from 'react'
import Editor from '@react-page/editor'

import slate from "@react-page/plugins-slate";
import image from "@react-page/plugins-image";
import spacer from "@react-page/plugins-spacer"
import  {imagePlugin} from "@react-page/plugins-image";

import "@react-page/editor/lib/index.css";
import "@react-page/plugins-image/lib/index.css";
import "@react-page/plugins-spacer/lib/index.css";
import "@react-page/plugins-slate/lib/index.css";

import { ColorPickerField } from '@react-page/editor';
import { pluginFactories } from '@react-page/plugins-slate';

const formFieldPlugin = pluginFactories.createComponentPlugin({
  addHoverButton: true, // whether to show it above the text when selected
  addToolbarButton: true, // whether to show it in the bottom toolbar
  type: 'SetColor', // a well defined string, this is kind of the id of the plugin
  object: 'mark', // mark is like a span, other options are inline and block
  icon: <span>Color</span>, // an icon to show
  label: 'Set Color',
  Component: 'span', // the component to render
  getStyle: ({ color }) => ({ color }),
  controls: {
    // identical to custom cell plugins
    type: 'autoform',
    schema: {
      type: 'object',
      required: ['color'],
      properties: {
        color: {
          uniforms: {
            component: ColorPickerField,
          },
          default: 'rgba(0,0,255,1)',
          type: 'string',
        },
      },
    },
  },
});

const customSlate = slate((config) => ({
    ...config,
    plugins: {
      ...config.plugins,
      yourCustomNamespace: {
        myCustomPlugin: formFieldPlugin()
      }
    },
  }));

const cellPlugins = [
    // slate(),
    customSlate,
    spacer,
    imagePlugin({
        imageUpload: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Derbys_Peter_Pan_peanut_butter_sample_blikje%2C_foto3.JPG'
      }),
    ];


const PromotionPage = () => {
    const [value, setValue] = useState(null);

    return (
        <div>
            <Editor
                cellPlugins={cellPlugins}
                value={value}
                onChange={setValue}
            />
            {/* <Editor
                    cellPlugins={cellPlugins}
                    value={value}
                    readOnly={true}
                /> */}
        </div>
    )
}

export default PromotionPage
