<div id="sr-groups">
	<section id="sr-create">
		<form>
			<label for="sr-group-name">New Group:</label>

			<input type="text" id="sr-group-name" name="sr-group-name" />

			<label for="sr-default">Set as Default</label>

			<input type="checkbox" id="sr-default" />

			<button type="submit">Add</button>
		</form>
	</section><!-- #sr-create -->

	<section id="sr-manage">
		<?php if( $groups ) : ?>
			<table>
				<tr>
					<th colspan="2">Group Info</th>

					<th colspan="2">Actions</th>
				</tr>

				<?php foreach( $groups as $g ) : ?>
					<tr class="sr-group" data-id="<?= $g->id; ?>">
						<td>
							<span><?= $g->name; ?></span>

							<img src="<?= base_url('assets/img/edit.png'); ?>" class="sr-edit" alt="Edit" title="Edit" />
						</td>

						<td>
							<label for="sr-group-default">Default: </label>

							<input type="checkbox" <?php if( $g->default ) echo 'checked="checked"'; ?> class="sr-group-default" name="sr-group-default" />
						</td>

						<td></td>

						<td>
							<img src="<?= base_url('assets/img/delete.png'); ?>" class="sr-delete" alt="Delete" title="Delete" />
						</td>
					</tr><!-- .sr-group -->
				<?php endforeach; ?>
			</table>
		<?php else : ?>
			<p>No Groups - Add Some?</p>
		<?php endif; ?>
	</section><!-- #sr-manage -->
</div><!-- #sr-groups -->