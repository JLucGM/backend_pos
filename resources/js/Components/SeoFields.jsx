import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Separator } from '@/Components/ui/separator';
import { Eye, Wand2, X, Edit, ArrowLeft } from 'lucide-react';

const SeoFields = ({
    data,
    setData,
    errors = {},
    autoGenerateFromFields = {}
}) => {
    const [keywords, setKeywords] = useState(data.meta_keywords || []);
    const [keywordInput, setKeywordInput] = useState('');
    const [showEditor, setShowEditor] = useState(false); // Estado para controlar vista previa vs editor

    useEffect(() => {
        setData('meta_keywords', keywords);
    }, [keywords]);

    // Auto-generate SEO fields when source fields change
    useEffect(() => {
        generateSeoFields();
    }, [...Object.values(autoGenerateFromFields)]);

    const generateSeoFields = () => {
        const title = autoGenerateFromFields.title || autoGenerateFromFields.product_name || '';
        const description = autoGenerateFromFields.description || autoGenerateFromFields.product_description || autoGenerateFromFields.content || '';

        if (title && !data.meta_title) {
            setData('meta_title', title.substring(0, 55));
        }

        if (description && !data.meta_description) {
            const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 155);
            setData('meta_description', cleanDescription);
        }

        // Generate keywords from title and description
        if (title && keywords.length === 0) {
            const generatedKeywords = extractKeywords(title + ' ' + description);
            setKeywords(generatedKeywords.slice(0, 10));
        }

        // Set Open Graph and Twitter fields if empty
        if (title && !data.og_title) {
            setData('og_title', title.substring(0, 55));
        }
        if (description && !data.og_description) {
            setData('og_description', description.replace(/<[^>]*>/g, '').substring(0, 155));
        }
        if (title && !data.twitter_title) {
            setData('twitter_title', title.substring(0, 55));
        }
        if (description && !data.twitter_description) {
            setData('twitter_description', description.replace(/<[^>]*>/g, '').substring(0, 155));
        }
    };

    const extractKeywords = (text) => {
        const stopWords = [
            'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las',
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did'
        ];

        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word))
            .filter((word, index, arr) => arr.indexOf(word) === index)
            .slice(0, 10);
    };

    const addKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim()) && keywords.length < 10) {
            setKeywords([...keywords, keywordInput.trim()]);
            setKeywordInput('');
        }
    };

    const removeKeyword = (keyword) => {
        setKeywords(keywords.filter(k => k !== keyword));
    };

    const handleKeywordKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeyword();
        }
    };

    const getCharacterCount = (text, limit) => {
        const count = text ? text.length : 0;
        const color = count > limit ? 'text-red-500' : count > limit * 0.8 ? 'text-yellow-500' : 'text-green-500';
        return { count, color };
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {showEditor ? (
                            <>
                                <Edit className="h-5 w-5" />
                                Configuración SEO
                            </>
                        ) : (
                            <>
                                <Eye className="h-5 w-5" />
                                Vista Previa SEO
                            </>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {showEditor && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={generateSeoFields}
                            >
                                <Wand2 className="h-4 w-4 mr-1" />
                                Regenerar
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant={showEditor ? "outline" : "default"}
                            size="sm"
                            onClick={() => setShowEditor(!showEditor)}
                        >
                            {showEditor ? (
                                <>
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Ver Vista Previa
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar SEO
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!showEditor ? (
                    // Vista Previa
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">Vista Previa en Google</h4>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                                    {data.meta_title || autoGenerateFromFields.title || autoGenerateFromFields.product_name || 'Título de la página'}
                                </div>
                                <div className="text-green-600 text-sm">
                                    https://ejemplo.com/{data.slug || 'pagina'}
                                </div>
                                <div className="text-gray-600 text-sm mt-1">
                                    {data.meta_description || (autoGenerateFromFields.description || autoGenerateFromFields.product_description || autoGenerateFromFields.content || 'Descripción de la página que aparecerá en los resultados de búsqueda...').replace(/<[^>]*>/g, '').substring(0, 155)}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Vista Previa en Facebook</h4>
                            <div className="border rounded-lg overflow-hidden bg-white max-w-md">
                                {(data.og_image || autoGenerateFromFields.image) && (
                                    <img
                                        src={data.og_image || autoGenerateFromFields.image}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-3">
                                    <div className="font-medium text-sm">
                                        {data.og_title || data.meta_title || autoGenerateFromFields.title || autoGenerateFromFields.product_name || 'Título de la página'}
                                    </div>
                                    <div className="text-gray-600 text-xs mt-1">
                                        {data.og_description || data.meta_description || (autoGenerateFromFields.description || autoGenerateFromFields.product_description || autoGenerateFromFields.content || 'Descripción de la página...').replace(/<[^>]*>/g, '').substring(0, 155)}
                                    </div>
                                    <div className="text-gray-400 text-xs mt-1">
                                        ejemplo.com
                                    </div>
                                </div>
                            </div>
                        </div>

                        {keywords.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Palabras Clave</h4>
                                <div className="flex flex-wrap gap-2">
                                    {keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Editor de Configuración SEO
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">SEO Básico</TabsTrigger>
                            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title">Título SEO</Label>
                                <Input
                                    id="meta_title"
                                    value={data.meta_title || ''}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder="Título optimizado para motores de búsqueda"
                                    maxLength={60}
                                />
                                <div className="flex justify-between text-xs">
                                    <span className={getCharacterCount(data.meta_title, 60).color}>
                                        {getCharacterCount(data.meta_title, 60).count}/60 caracteres
                                    </span>
                                    {errors.meta_title && (
                                        <span className="text-red-500">{errors.meta_title}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="meta_description">Descripción SEO</Label>
                                <Textarea
                                    id="meta_description"
                                    value={data.meta_description || ''}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    placeholder="Descripción que aparecerá en los resultados de búsqueda"
                                    maxLength={160}
                                    rows={3}
                                />
                                <div className="flex justify-between text-xs">
                                    <span className={getCharacterCount(data.meta_description, 160).color}>
                                        {getCharacterCount(data.meta_description, 160).count}/160 caracteres
                                    </span>
                                    {errors.meta_description && (
                                        <span className="text-red-500">{errors.meta_description}</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Palabras Clave</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyPress={handleKeywordKeyPress}
                                        placeholder="Agregar palabra clave"
                                        disabled={keywords.length >= 10}
                                    />
                                    <Button
                                        type="button"
                                        onClick={addKeyword}
                                        disabled={!keywordInput.trim() || keywords.length >= 10}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {keywords.map((keyword, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {keyword}
                                            <X
                                                className="h-3 w-3 cursor-pointer"
                                                onClick={() => removeKeyword(keyword)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {keywords.length}/10 palabras clave
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="social" className="space-y-4">
                            <div className="space-y-4">
                                <h4 className="font-medium">Open Graph (Facebook)</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="og_title">Título OG</Label>
                                    <Input
                                        id="og_title"
                                        value={data.og_title || ''}
                                        onChange={(e) => setData('og_title', e.target.value)}
                                        placeholder="Título para Facebook y otras redes sociales"
                                        maxLength={60}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="og_description">Descripción OG</Label>
                                    <Textarea
                                        id="og_description"
                                        value={data.og_description || ''}
                                        onChange={(e) => setData('og_description', e.target.value)}
                                        placeholder="Descripción para redes sociales"
                                        maxLength={160}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="og_image">Imagen OG (URL)</Label>
                                    <Input
                                        id="og_image"
                                        value={data.og_image || ''}
                                        onChange={(e) => setData('og_image', e.target.value)}
                                        placeholder="URL de la imagen para redes sociales"
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">Twitter</h4>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_title">Título Twitter</Label>
                                    <Input
                                        id="twitter_title"
                                        value={data.twitter_title || ''}
                                        onChange={(e) => setData('twitter_title', e.target.value)}
                                        placeholder="Título específico para Twitter"
                                        maxLength={60}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_description">Descripción Twitter</Label>
                                    <Textarea
                                        id="twitter_description"
                                        value={data.twitter_description || ''}
                                        onChange={(e) => setData('twitter_description', e.target.value)}
                                        placeholder="Descripción específica para Twitter"
                                        maxLength={160}
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="twitter_image">Imagen Twitter (URL)</Label>
                                    <Input
                                        id="twitter_image"
                                        value={data.twitter_image || ''}
                                        onChange={(e) => setData('twitter_image', e.target.value)}
                                        placeholder="URL de la imagen para Twitter"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </CardContent>
        </Card>
    );
};

export default SeoFields;