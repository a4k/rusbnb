import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';

const ReviewsBlock = styled(Grid)({
    width: '100%', minHeight: '50vh', marginTop: '5vh',
            justifyContent: 'left',
            gridAutoRows: '1fr',
            gridTemplateColumns: 'repeat(4, 1fr)',
            rowGap: '2vh'
})

export {ReviewsBlock};