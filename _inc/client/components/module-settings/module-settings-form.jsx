/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import { connectModuleOptions } from 'components/module-settings/connect-module-options';

export function ModuleSettingsForm( InnerComponent ) {
	const SettingsForm = React.createClass( {
		getInitialState() {
			return {
				options: {}
			}
		},
		onOptionChange( event ) {
			const optionName = event.target.name;
			let optionValue;
			// Get the option value from the `checked` property if present.
			if ( event.target.type === 'checkbox' ) {
				optionValue = typeof event.target.checked !== 'undefined'
					? event.target.checked
					: event.target.value;
			} else {
				optionValue = event.target.value;
			}

			this.updateFormStateOptionValue( optionName, optionValue );
		},
		updateFormStateOptionValue( optionName, optionValue ) {
			const newOptions = {
				...this.state.options,
				[ optionName ]: optionValue
			};
			this.setState( { options: newOptions } );
			this.props.setUnsavedOptionFlag();
			return true;
		},
		onSubmit( event ) {
			event.preventDefault();
			this.props.updateOptions( this.state.options )
				.then( () => {
					this.setState( { options: {} } )
				} );
			this.props.clearUnsavedOptionFlag();
		},

		/**
		 * Retrieves an option from an existing module, or from an array of modules
		 * if the form was initialized with an array
		 */
		getOptionValue( settingName ) {
			const currentValue = this.props.getSettingCurrentValue( settingName );
			return typeof this.state.options[ settingName ] !== 'undefined'
				 ? this.state.options[ settingName ]
				 : currentValue;
		},

		shouldSaveButtonBeDisabled() {
			let shouldItBeEnabled = false;
			// Check if the form is not currently dirty
			shouldItBeEnabled = ! this.isSavingAnyOption() && this.isDirty();
			return ! shouldItBeEnabled;
		},
		isDirty() {
			return !! Object.keys( this.state.options ).length;
		},
		isSavingAnyOption() {
			// Check if any of the updated options is still saving
			return this.props.isUpdating();
		},
		render() {
			return (
				<InnerComponent
					getOptionValue={ this.getOptionValue }
					onSubmit={ this.onSubmit }
					onOptionChange={ this.onOptionChange }
					updateFormStateOptionValue={ this.updateFormStateOptionValue }
					shouldSaveButtonBeDisabled={ this.shouldSaveButtonBeDisabled }
					isSavingAnyOption={ this.isSavingAnyOption }
					{ ...this.props } />
			);
		}
	} );
	return connectModuleOptions( SettingsForm );
}
