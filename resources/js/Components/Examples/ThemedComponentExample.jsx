import React from 'react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Componente de ejemplo que muestra cómo usar el hook useTheme
 * Este componente demuestra las mejores prácticas para aplicar temas consistentes
 */
const ThemedComponentExample = ({ themeSettings = {} }) => {
    // Usar el hook personalizado para obtener todas las utilidades del tema
    const { colors, fonts, styles, getTextStyle, getButtonStyle } = useTheme(themeSettings);
    
    return (
        <div style={styles.container}>
            <h1 style={styles.heading.h1}>
                Ejemplo de Componente con Tema
            </h1>
            
            <p style={styles.text.paragraph}>
                Este componente demuestra cómo usar correctamente el hook useTheme 
                para crear interfaces consistentes y personalizables.
            </p>
            
            <div style={styles.card}>
                <h2 style={{
                    ...styles.heading.h2,
                    marginBottom: '1rem'
                }}>
                    Botones Temáticos
                </h2>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button style={styles.button.primary}>
                        Botón Primario
                    </button>
                    
                    <button style={styles.button.secondary}>
                        Botón Secundario
                    </button>
                </div>
            </div>
            
            <div style={styles.card}>
                <h3 style={{
                    ...styles.heading.h3,
                    marginBottom: '1rem'
                }}>
                    Tipografía del Tema
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(level => (
                        <div key={level} style={{ marginBottom: '0.5rem' }}>
                            {React.createElement(
                                `h${level}`,
                                {
                                    style: {
                                        ...getTextStyle(`heading${level}`),
                                        margin: 0
                                    }
                                },
                                `Heading ${level}`
                            )}
                        </div>
                    ))}
                </div>
                
                <p style={{
                    ...styles.text.paragraph,
                    marginBottom: '1rem'
                }}>
                    Párrafo de ejemplo usando la configuración del tema. 
                    Fuente: {fonts.body}
                </p>
            </div>
            
            <div style={styles.card}>
                <h3 style={{
                    ...styles.heading.h3,
                    marginBottom: '1rem'
                }}>
                    Colores del Tema
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                        { name: 'Fondo', value: colors.background },
                        { name: 'Texto', value: colors.text },
                        { name: 'Títulos', value: colors.heading },
                        { name: 'Enlaces', value: colors.links },
                        { name: 'Bordes', value: colors.borders },
                        { name: 'Botón Primario', value: colors.primaryButton.background },
                        { name: 'Botón Secundario', value: colors.secondaryButton.background },
                    ].map(color => (
                        <div key={color.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: color.value,
                                border: `1px solid ${colors.borders}`,
                                borderRadius: '4px'
                            }} />
                            <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                                    {color.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: colors.text, opacity: 0.7 }}>
                                    {color.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div style={styles.card}>
                <h3 style={{
                    ...styles.heading.h3,
                    marginBottom: '1rem'
                }}>
                    Formulario de Ejemplo
                </h3>
                
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Nombre"
                        style={styles.input}
                    />
                    
                    <input 
                        type="email" 
                        placeholder="Email"
                        style={styles.input}
                    />
                    
                    <textarea 
                        placeholder="Mensaje"
                        rows={4}
                        style={{
                            ...styles.input,
                            resize: 'vertical'
                        }}
                    />
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" style={styles.button.primary}>
                            Enviar
                        </button>
                        
                        <button type="button" style={styles.button.secondary}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ThemedComponentExample;