import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Header from './Header';
import Filter from './Filter';
import SearchBlock from './SearchBlock';

export default function SearchPage (){
    return (
        <>
            <Header />
            <SearchBlock />
            <Box sx={{display: 'flex', flexDirection: 'row', width: '76vw', marginLeft: '12vw', marginTop: '5vh'}}>
                <Filter />
                <Box sx={{ width: '50%'}}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Material UI Create React App example in TypeScript
                    </Typography>
                </Box>
            </Box>
        </>
    )
}
