import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Index from "../routes/Home/Index";

test('Pagina Inicial', async () => {
    render(<Index />);

    // ? Alguna imagen de fondo representativa al proyecto
    expect(screen.getAllByRole('img')[0]).toBeInTheDocument()

    // ? Botón para ingresar al home (Ruta principal)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home')
})