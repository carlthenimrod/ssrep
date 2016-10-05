<div id="sr-geo">
	<form class="sr-search">
		<button type="submit">Locate</button>

		<div>
			<label for="sr-address" class="sr-address">Address:</label><!-- .sr-address -->

			<input type="textfield" id="sr-address" /><!-- #sr-address -->
		</div>

		<div>
			<label for="sr-city" class="sr-city">City:</label><!-- .sr-state -->

			<input type="textfield" id="sr-city" /><!-- #sr-city -->

			<label for="sr-state">State / Province:</label>

			<input type="textfield" id="sr-state" /><!-- #sr-state -->

			<label for="sr-zip">Zip:</label>

			<input type="textfield" id="sr-zip" /><!-- #sr-zip -->

			<label for="sr-country">Country:</label>
			
			<input type="textfield" id="sr-country" /><!-- #sr-country -->
		</div>
	</form>
</div><!-- #sr-geo -->

<div class="sr-body">
	<div class="sr-map">
		<div class="sr-msg"></div><!-- .sr-msg -->

		<div class="sr-edit-info">
			<form class="sr-info">
				<div class="sr-rep-info">
					<div>
						<label for="sr-name" class="sr-name">Name:</label>

						<input type="textfield" id="sr-name" /><!-- #sr-name -->

						<label for="sr-address" class="sr-address">Address:</label>

						<input type="textfield" id="sr-address" /><!-- #sr-address -->

						<label for="sr-city">City:</label>

						<input type="textfield" id="sr-city" /><!-- #sr-city -->

						<label for="sr-state">State:</label>

						<input type="textfield" id="sr-state" /><!-- #sr-state -->

						<label for="sr-zip">Zip:</label>

						<input type="textfield" id="sr-zip" /><!-- #sr-zip -->
					</div>

					<div>
						<label for="sr-company" class="sr-company">Company:</label>

						<input type="textfield" id="sr-company" /><!-- #sr-company -->

						<label for="sr-phone">Phone:</label>

						<input type="textfield" id="sr-phone" /><!-- #sr-phone -->

						<label for="sr-cell">Cell:</label>

						<input type="textfield" id="sr-cell" /><!-- #sr-cell -->
						
						<label for="sr-fax">Fax:</label>

						<input type="textfield" id="sr-fax" /><!-- #sr-fax -->

						<label for="sr-email">Email:</label>

						<input type="textfield" id="sr-email" /><!-- #sr-email -->

						<label for="sr-web">Web:</label>

						<input type="textfield" id="sr-web" /><!-- #sr-web -->
					</div>
				</div>

				<div class="sr-loading">
					<img src="<?= base_url(); ?>assets/img/ajax-loader.gif" />
				</div><!-- .sr-loading -->

				<div class="sr-btns">
					<button type="button" name="hide" class="sr-hide">Hide</button><!-- .sr-hide -->

					<button type="button" name="delete" class="sr-delete">Delete</button><!-- .sr-delete -->

					<button type="reset" name="reset">Reset</button>

					<button type="submit" name="submit">Save</button>
				</div><!-- .sr-btns -->

				<input type="hidden" id="sr-save" value="1" />

				<input type="hidden" id="sr-id" />
			</form>
		</div><!-- .sr-edit-info -->

		<div id="sr-map"></div><!-- #sr-map -->
	</div><!-- .sr-map -->
</div><!-- .sr-body -->