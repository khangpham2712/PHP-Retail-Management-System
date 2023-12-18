import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';

import InfoTwoToneIcon from '@material-ui/icons/InfoTwoTone';
import {Typography,Tooltip} from '@material-ui/core';

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#6b6b6b',
      // color: 'rgba(0, 0, 0, 0.87)',
      color: '#fff',
      // maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #000',
    },
  }))(Tooltip);

const MoreInfo = (props) => {
  const {title, content} = props
    return (
        <div> 
            <HtmlTooltip
                arrow
                title={
                <React.Fragment>
                    {/* <Typography color="inherit">Tooltip with HTML</Typography>
                    <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
                    {"It's very engaging. Right?"} */}
                    {props.children}
                </React.Fragment>
                }
            >
              <InfoTwoToneIcon fontSize="small" />
            </HtmlTooltip>
        </div>
    )
}

export default MoreInfo
