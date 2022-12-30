import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Home from "../routes/Home/Home";

test('Pagina Inicial', async () => {
    render(<Home />);

    // ? Input de búsqueda para encontrar países por nombre
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
})