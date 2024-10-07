import {connect, RenderFieldExtensionCtx} from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen, {PluginParameters} from "./ConfigScreen.tsx";
import {render} from "./utils/render";
import {CustomFieldValidation} from "./CustomFieldValidation.tsx";

connect({
    onBeforeItemUpsert(payload, ctx) {
        const {isValid} = ctx.plugin.attributes.parameters as PluginParameters

        if (!isValid) {
            console.log('Invalid', payload)
            ctx.alert(`Validation error`)
            return false
        } else {
            return true
        }
    },

    renderConfigScreen(ctx) {
        return render(<ConfigScreen ctx={ctx}/>);
    },

    manualFieldExtensions() {
        return [
            {
                id: 'customFieldValidation',
                name: 'Custom Field Validation',
                type: 'editor',
                fieldTypes: ['string'],
            },
        ];
    },

    renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
        if (fieldExtensionId === 'customFieldValidation') {
            return render(<CustomFieldValidation ctx={ctx}/>);
        }
    },

});
