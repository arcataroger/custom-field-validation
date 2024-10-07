import {Canvas, TextField} from 'datocms-react-ui';
import {RenderFieldExtensionCtx} from "datocms-plugin-sdk";
import {useEffect, useMemo, useState} from "react";
import {PluginParameters, ValidatorFunction} from "./ConfigScreen.tsx";


export const CustomFieldValidation = ({ctx}: { ctx: RenderFieldExtensionCtx }) => {

    const {formValues, fieldPath, field, setFieldValue, updatePluginParameters, plugin} = ctx;
    const {api_key} = field.attributes;
    const pluginParams = plugin.attributes.parameters as PluginParameters;

    const validatorFn = new Function('input', pluginParams.validatorFn) as ValidatorFunction

    const originalValue = formValues[fieldPath] as string;

    const [currentValue, setCurrentValue] = useState<string>(originalValue);

    const postToRecord = () => {
        console.log('setting field value to', currentValue)
        setFieldValue(fieldPath, currentValue)
    }

    const isValid = useMemo<boolean>(() => {
        return validatorFn(currentValue)
    }, [currentValue]);


    useEffect(() => {
            if (!isValid) {
                updatePluginParameters({
                    ...pluginParams,
                    isValid: false
                })
            }

            if (currentValue && isValid) {
                postToRecord()
                updatePluginParameters({
                    ...pluginParams,
                    isValid: true
                })
            }

        }
        , [isValid, currentValue]
    );


    return (
        <Canvas ctx={ctx}>
            <TextField
                name={api_key}
                id={api_key}
                label={null} // We don't need to show this again because the field wrapper already shows it
                hint={isValid ? pluginParams.customError : null}
                value={currentValue}
                error={!isValid && pluginParams.customError}
                onChange={setCurrentValue}
            />
        </Canvas>
    );
};