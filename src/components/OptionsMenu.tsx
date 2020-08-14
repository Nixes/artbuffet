import React from "react";

export class OptionsMenu extends React.PureComponent<
    {changeSortOrder: (newSortOrder:string) => void, sortingOptions: string[], defaultSortOrder: string },
    {selectedSorting:number,value:string}> {

    constructor(props) {
        super(props);

        this.state = {
            value: props.defaultSortOrder,
            selectedSorting:0,
        };
    }

    private handleChange = (event) => {
        this.setState({value: event.target.value});
        this.props.changeSortOrder(event.target.value);
    }

    public render = () => {
        return (
            <div id="options-bar">
                <label htmlFor='sortOrderSelector'>Sort Order </label>
                <select id='sortOrderSelector' value={this.state.value} onChange={this.handleChange}>
                    {this.props.sortingOptions.map(function(name, index){
                        return <option key={ index } value={name}>{name}</option>;
                    })}
                </select>
            </div>
        );
    }
}