import {Button, Canvas, TextareaField, TextField} from 'datocms-react-ui';
import {RenderConfigScreenCtx} from "datocms-plugin-sdk";
import {useState} from "react";

export type ValidatorFunction = (input: string) => boolean;

export type PluginParameters = {
    isValid: boolean,
    validatorFn: string,
    customError: string,
};

type PropTypes = {
    ctx: RenderConfigScreenCtx;
};

const validatorPlaceholder:string = `
// The input parameter MUST be called "input", and you must return a boolean true/false
(input: string): boolean => {

    // Your test goes here
    if (input==='invalid input') {
        return false
    }
    
    return true
}`

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

    return (
        <Canvas ctx={ctx}>
            <TextareaField
                id='validatorFn'
                name='validatorFn'
                label="Validator function"
                value={validatorFn}
                onChange={setValidatorFn}
                placeholder={validatorPlaceholder}
            />

            <TextField
                id='customError'
                name='customError'
                label='Custom error message'
                value={customError}
                onChange={setCustomError}
            />

            <Button onClick={onSave}>Save</Button>

        </Canvas>
    );
}