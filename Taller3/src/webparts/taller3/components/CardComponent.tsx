import * as React from 'react';
import { IFile } from './interface';
import { Stack, Text } from '@fluentui/react';
import styles from './Taller3.module.scss';

interface ICardComponentProps {
    item: IFile;
}

const CardComponent: React.FC<ICardComponentProps> = ({ item }) => {
    return (
        <Stack tokens={{ childrenGap: 10 }} className={styles.card}>
            <Stack.Item>
                <br/>
                <Text variant="large" block>
                    {item.Title}
                </Text>
                <Text>{item.Description}</Text>
                <br/>
                <Text variant="small" styles={{ root: { color: '#888888' } }}>
                    Categoría: {item.Category}
                </Text>
                <br/>
                <Text variant="small" styles={{ root: { color: '#888888' } }}>
                    Fecha de publicación: {item.PublicationDate}
                </Text>
                <br/>
                <Text variant="small" styles={{ root: { color: '#888888' } }}>
                    URL de la imagen: {item.URL}
                </Text>

                <br/>
                <br/>
            </Stack.Item>
        </Stack>
    );
};

export default CardComponent;

