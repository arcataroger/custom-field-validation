import {Button, Canvas, FieldHint, Form, FormLabel, TextField} from 'datocms-react-ui';
import {RenderConfigScreenCtx} from "datocms-plugin-sdk";
import {Fragment, useCallback, useMemo, useRef, useState} from "react";
import {Highlight, themes} from "prism-react-renderer";
import {useEditable} from "use-editable";
import './code-editor-styles.css';

export type ValidatorFunction = (input: string) => boolean;

export type PluginParameters = {
    isValid: boolean,
    validatorFn: string,
    customError: string,
    field?: {
        label: string,
        path: string,
    }
};

type PropTypes = {
    ctx: RenderConfigScreenCtx;
};

const validatorFnPlaceholder = `
/**
Provide a JS function that takes an "input" param and returns boolean true/false.
Typescript is not supported.
*/

(input) => {
    
    // Return false to fail validation
    if(input === 'invalid input') {
        return false
    }
    
    // Return true to pass validation
    return true
}
`

export default function ConfigScreen({ctx}: PropTypes) {
    const pluginParams = ctx.plugin.attributes.parameters as PluginParameters;

    const [customError, setCustomError] = useState<string>(pluginParams.customError ?? '');
    const [validatorFn, setValidatorFn] = useState<string>(pluginParams.validatorFn ?? validatorFnPlaceholder);

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

    const editorRef = useRef(null);
    const onEditableChange = useCallback((code: string) => {
        setValidatorFn(code.slice(0, -1));
    }, []);

    useEditable(editorRef, onEditableChange, {
        indentation: 2,
    });

    return (
        <Canvas ctx={ctx}>
            <Form>
                <FormLabel htmlFor={'code-editor'}>Custom validator function</FormLabel>
                <Highlight code={validatorFn} language="JavaScript" theme={themes.nightOwlLight}>
                    {({style, tokens, getTokenProps}) => (
                        <pre id='code-editor' className={'code-editor'} style={style} ref={editorRef}>
                      {tokens.map((line, i) => (
                          <Fragment key={i}>
                              {line
                                  .filter((token) => !token.empty)
                                  .map((token, key) => (
                                      <span {...getTokenProps({token, key})} />
                                  ))}
                              {"\n"}
                          </Fragment>
                      ))}
                    </pre>
                    )}
                </Highlight>
                <FieldHint>Must be a JS function that takes an "input" param as string and returns a boolean. Typescript is not supported.</FieldHint>

                <TextField
                    id='customError'
                    name='customError'
                    label='Custom validation message'
                    hint='This is what your editors see'
                    placeholder='Input must not be "invalid input"'
                    value={customError}
                    onChange={setCustomError}
                />

                <Button onClick={onSave} disabled={!isDirty}>{isDirty ? 'Save' : 'Saved!'}</Button>

            </Form>
        </Canvas>
    );
}