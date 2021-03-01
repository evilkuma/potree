

import {MeasurePanel} from "./MeasurePanel.js";

export class AreaPanel extends MeasurePanel{
	constructor(viewer, measurement, propertiesPanel){
		super(viewer, measurement, propertiesPanel);

		let removeIconPath = Potree.resourcePath + '/icons/remove.svg';
		this.elContent = $(`
			<div class="measurement_content selectable">
				Export self measure:
				<br> 
				<a href="#" download="measure.json">
					<img name="pcv_json_export" src="http://localhost:1234/build/potree/resources/icons/file_geojson.svg" class="" style="height: 24px">
				</a>
				<br> 
				<span class="coordinates_table_container"></span>
				<br>
				<span style="font-weight: bold">Area: </span>
				<span id="measurement_area"></span>

				<!-- ACTIONS -->
				<div style="display: flex; margin-top: 12px">
					<span></span>
					<span style="flex-grow: 1"></span>
					<img name="remove" class="button-icon" src="${removeIconPath}" style="width: 16px; height: 16px"/>
				</div>
			</div>
		`);

		this.elRemove = this.elContent.find("img[name=remove]");
		this.elRemove.click( () => {
			this.viewer.scene.removeMeasurement(measurement);
		});

		let elDownloadJSON = this.elContent.find("img[name=pcv_json_export]").parent();
		elDownloadJSON.click( (event) => {
			
			let json = JSON.stringify(measurement.toJSON());

			let url = window.URL.createObjectURL(new Blob([json], {type: 'data:application/octet-stream'}));
			elDownloadJSON.attr('href', url);
			
		});

		this.propertiesPanel.addVolatileListener(measurement, "marker_added", this._update);
		this.propertiesPanel.addVolatileListener(measurement, "marker_removed", this._update);
		this.propertiesPanel.addVolatileListener(measurement, "marker_moved", this._update);

		this.update();
	}

	update(){
		let elCoordiantesContainer = this.elContent.find('.coordinates_table_container');
		elCoordiantesContainer.empty();
		elCoordiantesContainer.append(this.createCoordinatesTable(this.measurement.points.map(p => p.position)));

		let elArea = this.elContent.find(`#measurement_area`);
		elArea.html(this.measurement.getArea().toFixed(3));
	}
};