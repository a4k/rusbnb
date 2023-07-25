import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

const ReviewsBlock = styled(Grid)({
    width: '100%', minHeight: '10vh', marginTop: '5vh',
            justifyContent: 'left',
            gridAutoRows: '1fr',
            gridTemplateColumns: 'repeat(2, 1fr)',
            rowGap: '2vh'
})

export {ReviewsBlock};