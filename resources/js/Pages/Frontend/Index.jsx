

export default function Index({ page, themeSettings }) {
    return (
        <>
        <h1>{page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </>
    );
}

