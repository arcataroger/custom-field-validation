import {Button, Canvas, Form, FormLabel, TextField} from 'datocms-react-ui';
import {RenderConfigScreenCtx} from "datocms-plugin-sdk";
import {useMemo, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {javascript} from '@codemirror/lang-javascript';

export type ValidatorFunction = (input: string) => boolean;

export type PluginParameters = {
    isValid: boolean,
    validatorFn: string,
    customError: string,
};

type PropTypes = {
    ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ctx}: PropTypes) {
    const pluginParams = ctx.plugin.attributes.parameters as PluginParameters;

    const [customError, setCustomError] = useState<string>(pluginParams.customError ?? '');
    const [validatorFn, setValidatorFn] = useState<string>(pluginParams.validatorFn ?? '');

    const onSave = () => {
        ctx.updatePluginParameters({
            ...pluginParams,
            validatorFn,
            customError,
        }).then(() => {
            ctx.notice('Settings saved')
        })

    }

    const isDirty: boolean = useMemo(() => {
        return (pluginParams.validatorFn != validatorFn || pluginParams.customError != customError);
    }, [customError, validatorFn, pluginParams.validatorFn, pluginParams.customError]);

    return (
        <Canvas ctx={ctx}>
            <Form>
                <FormLabel htmlFor={'codemirror'}>Custom validator</FormLabel>
                <CodeMirror
                    id='codemirror'
                    extensions={[javascript()]}
                    value={validatorFn}
                    onChange={setValidatorFn}
                />

                <TextField
                    id='customError'
                    name='customError'
                    label='Custom error message'
                    hint='Validation message that editors see'
                    value={customError}
                    onChange={setCustomError}
                />

                <Button onClick={onSave} disabled={!isDirty}>{isDirty ? 'Save' : 'Saved!'}</Button>

            </Form>
        </Canvas>
    );
}