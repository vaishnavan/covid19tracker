import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './info.css'

function Infobox({title, cases, total , ...props}) {
    return (
        <div className="infoBox">
            <Card onClick={props.onClick} className="card">
                <CardContent>
                    <Typography style={{fontWeight:"bolder",fontSize:"20px"}} className="infoBox_title" color="textSecondary">
                        {title}
                    </Typography>

                    <h2 className="infoBox_cases">{cases}</h2>


                    <Typography className="infoBox_total" color="textSecondary" >
                        {total} 
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}

export default Infobox;
