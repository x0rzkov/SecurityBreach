import React from 'react';
import compose from 'recompose/compose';
import { translate } from 'react-admin';
import { Button, Card, CardActions, CardContent, withStyles, Typography } from '@material-ui/core';
import QueueIcon from '@material-ui/icons/Queue';
import HelpIcon from '@material-ui/icons/Help';
import NoteAddIcon from '@material-ui/icons/NoteAdd';

const styles = {
    media: {
        height: '18em',
    },
};


const CardWelcome = ({ classes, translate }) => (
    <Card>
        <CardContent>
            <Typography variant="headline" component="h3">
                Help Wanted
            </Typography>
            <Typography component="p">
                Submit a breach or help categorize a breach we've collected in our intake queue.
            </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'flex-start' }}>
            <Button href="#/breaches/create" style={{ 'margin-top': '1em' }}>
                <NoteAddIcon style={{ paddingRight: '0.5em' }} />
                New Breach
            </Button>
            <Button href="https://github.com/ericalexanderorg/SecurityBreach/issues?q=is%3Aissue+is%3Aopen+label%3Aintake">
                <QueueIcon style={{ paddingRight: '0.5em' }} />
                Intake Queue
            </Button>
            <Button href="https://github.com/PointCloudLibrary/pcl/wiki/A-step-by-step-guide-on-preparing-and-submitting-a-pull-request">
                <HelpIcon style={{ paddingRight: '0.5em' }} />
                How to submit a pull request (PR)
            </Button>
        </CardActions>
    </Card>
);

const enhance = compose(
    withStyles(styles),
    translate
);

export default enhance(CardWelcome);